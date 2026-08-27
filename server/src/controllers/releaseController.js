const prisma = require('../config/prisma');
const storageService = require('../services/storageService');
const auditService = require('../services/auditService');

exports.listReleases = async (req, res, next) => {
  try {
    const { productId, releaseChannel, platform } = req.query;

    const where = {
      ...(productId && { product_id: productId }),
      ...(releaseChannel && { release_channel: releaseChannel }),
      ...(platform && { platform })
    };

    const releases = await prisma.release.findMany({
      where,
      include: {
        product: true,
        edition: true
      },
      orderBy: { published_at: 'desc' }
    });

    // Format BigInt for JSON serialization
    const formatted = releases.map((r) => ({
      ...r,
      file_size_bytes: r.file_size_bytes.toString()
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

exports.getReleaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const release = await prisma.release.findUnique({
      where: { id },
      include: {
        product: true,
        edition: true
      }
    });

    if (!release) {
      return res.status(404).json({ success: false, message: 'Release not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...release,
        file_size_bytes: release.file_size_bytes.toString()
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate a short-lived (10 min) signed download token
 */
exports.generateDownloadToken = async (req, res, next) => {
  try {
    const { id } = req.params;

    const release = await prisma.release.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!release) {
      return res.status(404).json({ success: false, message: 'Release not found' });
    }

    const token = storageService.generateSignedDownloadToken({
      releaseId: release.id,
      userId: req.user.id,
      orgId: req.user.orgId,
      version: release.version,
      platform: release.platform,
      expiresInMinutes: 10
    });

    const downloadUrl = `/api/v1/releases/${release.id}/download?token=${token}`;

    return res.status(200).json({
      success: true,
      data: {
        downloadUrl,
        token,
        expiresInSeconds: 600,
        checksum: release.checksum,
        filename: `kavachiq-${release.product.code}-${release.version}-${release.platform}.${release.package_type}`
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Download package endpoint with token verification
 */
exports.downloadPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Signed download token required in query parameter'
      });
    }

    const verification = storageService.verifyDownloadToken(token);
    if (!verification.valid || verification.data.releaseId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Signed download token has expired or is invalid'
      });
    }

    const release = await prisma.release.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!release) {
      return res.status(404).json({ success: false, message: 'Release not found' });
    }

    // Increment download counter
    await prisma.release.update({
      where: { id },
      data: { download_count: { increment: 1 } }
    });

    await auditService.logEvent({
      actorId: verification.data.userId,
      orgId: verification.data.orgId,
      action: 'PACKAGE_DOWNLOADED',
      target: `Release:${release.product.name} v${release.version}`,
      metadata: { releaseId: release.id, checksum: release.checksum },
      req
    });

    const fileContent = storageService.generatePackageContent(
      release.product.name,
      release.version,
      release.platform,
      release.package_type
    );

    const filename = `kavachiq-${release.product.code}-${release.version}-${release.platform}.${release.package_type}`;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Checksum-SHA256', release.checksum);
    return res.send(fileContent);
  } catch (err) {
    next(err);
  }
};

// Admin Create / Publish Release
exports.createRelease = async (req, res, next) => {
  try {
    const { productId, editionId, version, packageType, platform, fileSizeBytes, releaseChannel, releaseNotes, customChecksum } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const checksum = customChecksum || storageService.generateChecksum(`KAVACHIQ-PACKAGE-${product.code}-${version}-${platform}-${Date.now()}`);

    const newRelease = await prisma.release.create({
      data: {
        product_id: productId,
        edition_id: editionId || null,
        version: version,
        package_type: packageType || 'tar.gz',
        platform: platform || 'linux-x86_64',
        checksum: checksum,
        storage_path: `/storage/packages/${product.code}/${version}/package.${packageType || 'tar.gz'}`,
        file_size_bytes: BigInt(fileSizeBytes || 268435456),
        release_channel: releaseChannel || 'stable',
        release_notes: releaseNotes || 'Official enterprise production release.',
        published_at: new Date()
      },
      include: {
        product: true
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'ADMIN_RELEASE_PUBLISHED',
      target: `Release:${newRelease.product.code} v${newRelease.version}`,
      metadata: { checksum, platform, releaseChannel },
      req
    });

    return res.status(201).json({
      success: true,
      message: 'Software release published successfully',
      data: {
        ...newRelease,
        file_size_bytes: newRelease.file_size_bytes.toString()
      }
    });
  } catch (err) {
    next(err);
  }
};

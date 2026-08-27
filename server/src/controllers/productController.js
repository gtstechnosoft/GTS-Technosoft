const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

exports.listProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        editions: {
          orderBy: { name: 'asc' }
        },
        releases: {
          take: 3,
          orderBy: { published_at: 'desc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

exports.getProductByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const product = await prisma.product.findUnique({
      where: { code: code.toLowerCase() },
      include: {
        editions: true,
        releases: {
          orderBy: { published_at: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: `Product with code '${code}' not found` });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.getProductEditions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const editions = await prisma.edition.findMany({
      where: { product_id: id },
      include: {
        releases: true
      }
    });

    return res.status(200).json({ success: true, data: editions });
  } catch (err) {
    next(err);
  }
};

// Admin endpoints
exports.createProduct = async (req, res, next) => {
  try {
    const { code, name, category, tagline, description, lifecycle_state, icon } = req.body;

    const product = await prisma.product.create({
      data: {
        code: code.toLowerCase().trim(),
        name,
        category,
        tagline,
        description,
        lifecycle_state: lifecycle_state || 'GA',
        icon
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'ADMIN_PRODUCT_CREATED',
      target: `Product:${product.code}`,
      metadata: { name: product.name },
      req
    });

    return res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (err) {
    next(err);
  }
};

exports.createEdition = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { code, name, featureProfile, releaseChannel } = req.body;

    const edition = await prisma.edition.create({
      data: {
        product_id: productId,
        code: code.toLowerCase().trim(),
        name,
        feature_profile: featureProfile || {},
        release_channel: releaseChannel || 'stable'
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'ADMIN_EDITION_CREATED',
      target: `Edition:${edition.code}`,
      metadata: { productId, name: edition.name },
      req
    });

    return res.status(201).json({ success: true, message: 'Edition created', data: edition });
  } catch (err) {
    next(err);
  }
};

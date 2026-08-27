const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

class StorageService {
  constructor() {
    this.secret = config.DOWNLOAD_TOKEN_SECRET;
  }

  /**
   * Generate a short-lived (5-10 min) cryptographically signed download URL token
   */
  generateSignedDownloadToken({ releaseId, userId, orgId, version, platform, expiresInMinutes = 10 }) {
    const token = jwt.sign(
      {
        releaseId,
        userId,
        orgId,
        version,
        platform,
        type: 'SECURE_RELEASE_DOWNLOAD'
      },
      this.secret,
      { expiresIn: `${expiresInMinutes}m` }
    );

    return token;
  }

  /**
   * Verify a download token
   */
  verifyDownloadToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (decoded.type !== 'SECURE_RELEASE_DOWNLOAD') {
        return { valid: false, error: 'Invalid token purpose' };
      }
      return { valid: true, data: decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }

  /**
   * Compute SHA-256 hash for simulated packages or buffers
   */
  generateChecksum(bufferOrString) {
    return crypto.createHash('sha256').update(bufferOrString).digest('hex');
  }

  /**
   * Generate simulated package metadata & binary placeholder
   */
  generatePackageContent(productName, version, platform, packageType) {
    return `#!/bin/bash
# ==============================================================================
# GTS TECHNOSOFT AI LLP - KavachIQ Enterprise Installation Package
# Product: ${productName}
# Version: ${version}
# Platform: ${platform}
# Package Type: ${packageType}
# Built: ${new Date().toISOString()}
# Copyright (c) 2026 GTS TECHNOSOFT AI LLP. All Rights Reserved.
# ==============================================================================

echo "================================================================"
echo " Starting KavachIQ ${productName} v${version} Installation"
echo " Platform: ${platform}"
echo " Verifying cryptographic signature and runtime environment..."
echo "================================================================"

sleep 1
echo "[+] Validating host kernel and CPU architecture..."
echo "[+] Pre-allocating high-throughput storage directories..."
echo "[+] Initializing KavachIQ Security Agent & telemetry daemon..."
echo "[OK] Installation completed successfully."
echo "Please activate using your .lic license file via: kavachiq-ctl license load /path/to/license.lic"
exit 0
`;
  }
}

module.exports = new StorageService();

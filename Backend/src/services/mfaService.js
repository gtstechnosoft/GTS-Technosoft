const { authenticator } = require('otplib');
const QRCode = require('qrcode');

class MfaService {
  constructor() {
    authenticator.options = {
      window: 1 // Allow 1 step backward/forward for clock drift
    };
  }

  /**
   * Generate secret key and OTP Auth URI
   */
  generateSecret(userEmail) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      encodeURIComponent(userEmail),
      'GTS KavachIQ Portal',
      secret
    );

    return { secret, otpauth };
  }

  /**
   * Generate QR Code as Data URL
   */
  async generateQrCodeDataUrl(otpauthUrl) {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (err) {
      throw new Error(`Failed to generate QR Code: ${err.message}`);
    }
  }

  /**
   * Verify TOTP token against secret
   */
  verifyToken(token, secret) {
    if (!token || !secret) return false;
    try {
      return authenticator.check(token.trim(), secret);
    } catch (err) {
      return false;
    }
  }
}

module.exports = new MfaService();

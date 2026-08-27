const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'gts_kavachiq_super_secure_access_secret_2026_dev_key',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'gts_kavachiq_super_secure_refresh_secret_2026_dev_key',
    ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  LICENSE_SIGNING_SECRET: process.env.LICENSE_SIGNING_SECRET || 'gts_kavachiq_master_license_signing_key_secret_2026_dev',
  DOWNLOAD_TOKEN_SECRET: process.env.DOWNLOAD_TOKEN_SECRET || 'gts_kavachiq_storage_download_hmac_secret_2026_dev',
  STORAGE_LOCAL_DIR: process.env.STORAGE_LOCAL_DIR || './storage/packages'
};

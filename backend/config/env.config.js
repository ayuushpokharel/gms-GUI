// ─── Server ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Database ─────────────────────────────────────────────────────────────────
const DB_URI = process.env.db;

// ─── JWT ──────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "5d";
const COOKIE_EXPIRE = Number(process.env.COOKIE_EXPIRE) || 5;

// ─── Email / SMTP ─────────────────────────────────────────────────────────────
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_SERVICE = process.env.SMPT_SERVICE;
const SMTP_MAIL = process.env.SMPT_MAIL;
const SMTP_PASSWORD = process.env.SMPT_PASSWORD;

// ─── Cloudinary ───────────────────────────────────────────────────────────────
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// ─── Stripe ───────────────────────────────────────────────────────────────────
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// ─── Validation ───────────────────────────────────────────────────────────────
const REQUIRED = [
  ["DB_URI", DB_URI],
  ["JWT_SECRET", JWT_SECRET],
  ["SMTP_HOST", SMTP_HOST],
  ["SMTP_SERVICE", SMTP_SERVICE],
  ["SMTP_MAIL", SMTP_MAIL],
  ["SMTP_PASSWORD", SMTP_PASSWORD],
  ["CLOUDINARY_NAME", CLOUDINARY_NAME],
  ["CLOUDINARY_API_KEY", CLOUDINARY_API_KEY],
  ["CLOUDINARY_API_SECRET", CLOUDINARY_API_SECRET],
  ["STRIPE_API_KEY", STRIPE_API_KEY],
  ["STRIPE_SECRET_KEY", STRIPE_SECRET_KEY],
];

const missing = REQUIRED.filter(([, value]) => !value).map(([key]) => key);
if (missing.length > 0) {
  console.error(
    `[env.config] Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

module.exports = {
  PORT,
  FRONTEND_URL,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRE,
  COOKIE_EXPIRE,
  SMTP_HOST,
  SMTP_SERVICE,
  SMTP_MAIL,
  SMTP_PASSWORD,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  STRIPE_API_KEY,
  STRIPE_SECRET_KEY,
};

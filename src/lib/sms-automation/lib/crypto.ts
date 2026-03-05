import { createCipheriv, createDecipheriv, createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 64;

/**
 * Derive an encryption key from DATABASE_URL via SHA-256.
 * If someone has the connection string, they already have full DB access,
 * so this just prevents casual exposure in DB tools/backups/logs.
 */
function deriveKey(): Buffer {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for encryption');
  }
  return createHash('sha256').update(databaseUrl).digest();
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns format: base64(iv):base64(ciphertext):base64(authTag)
 */
export function encrypt(plaintext: string): string {
  const key = deriveKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${encrypted}:${authTag.toString('base64')}`;
}

/**
 * Decrypt an encrypted string produced by encrypt().
 */
export function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format');
  }

  const [ivBase64, ciphertext, authTagBase64] = parts;
  const key = deriveKey();
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Hash a password using scrypt (no external dependencies).
 * Returns format: base64(salt):base64(hash)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt.toString('base64')}:${derivedKey.toString('base64')}`;
}

/**
 * Verify a password against a stored hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }

  const [saltBase64, hashBase64] = parts;
  const salt = Buffer.from(saltBase64, 'base64');
  const storedKey = Buffer.from(hashBase64, 'base64');
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(storedKey, derivedKey);
}

/**
 * Mask a sensitive value for display (e.g., "sk_****...1234").
 */
export function maskValue(value: string | null | undefined): string {
  if (!value) return '';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}****${value.slice(-4)}`;
}

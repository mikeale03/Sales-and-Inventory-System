/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import crypto from 'crypto';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function saltAndHash(
  password: string,
  iterations: number = 1000,
  length: number = 64
) {
  // Creating a unique salt for a particular user
  const salt = crypto.randomBytes(16).toString('hex');

  // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, length, `sha512`)
    .toString(`hex`);
  return {
    salt,
    hash,
  };
}

export function isValidPassword(
  password: string,
  hashPassword: string,
  salt: string,
  iterations: number = 1000,
  length: number = 64
) {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, iterations, length, `sha512`)
    .toString(`hex`);
  return passwordHash === hashPassword;
}

import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { z } from 'zod';

export function getPublicPath() {
  return path.resolve(__dirname, '..', 'public');
}

/**
 * Get the path to the email template
 * @param {string} template
 * @returns {string}
 */
export function getEmailTemplatePath(template) {
  return path.resolve(__dirname, '..', 'email-templates', template);
}

/**
 * Get the absolute path of a file
 * @param {string[]} parts
 * @returns {string}
 */
export function getAbsolutePath(parts) {
  return path.resolve(__dirname, '..', ...parts);
}

/**
 *
 * @param {z.ZodError} error
 * @returns {{ conciseErrorMessages: string, errorObject: Record<string, string> }}
 */
export default function formatZodError(error) {
  const fieldErrors = error.issues;

  /** @type {Record<string, string>} */
  const errorObject = {};

  fieldErrors.forEach((fieldError) => {
    const path = fieldError.path.join('.');
    errorObject[path] = fieldError.message;
  });

  const conciseErrorMessages = Object.entries(errorObject)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return { conciseErrorMessages, errorObject };
}

export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

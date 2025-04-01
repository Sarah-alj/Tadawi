import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Handle Base64 file upload
 * @param {string} base64String
 * @param {string} filename
 * @returns {Promise<string>}
 */
export async function handleBase64Upload(base64String, filename) {
  // Extract the MIME type and Base64 data
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || !matches[1] || !matches[2]) {
    throw new Error('Invalid Base64 string');
  }
  const mimeType = matches[1]; // e.g., 'image/png' or 'image/jpeg'
  const base64Data = matches[2];
  // Get the file extension from MIME type
  const extension = mimeType.split('/')[1]; // 'png', 'jpeg', etc.
  // Save the file to the uploads directory
  const filePath = path.resolve(__dirname, '..', 'uploads', filename + '.' + extension);
  await fsPromises.writeFile(filePath, base64Data, 'base64');
  return path.join('uploads', filename + '.' + extension);
}

const MAX_SIZE_IN_MB = 5;
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
const PDF_EXTENSIONS = ['pdf'];

/**
 * Handle file upload. Returns a promise that resolves with the file data
 * if the file is valid, or rejects with an error message if the file is invalid.
 * @param {File} file
 * @param {'image' | 'pdf' | 'both'} type
 * @returns {Promise<{isOk: true, data: string, type: 'image' | 'pdf'} | {isOk: false, error: string}>}
 */
export function handleFileUpload(file, type = 'image') {
  const ALLOWED_EXTENSIONS =
    type === 'image' ? IMAGE_EXTENSIONS : type === 'pdf' ? PDF_EXTENSIONS : [...IMAGE_EXTENSIONS, ...PDF_EXTENSIONS];
  if (!file) {
    return {
      isOk: false,
      error: 'No file selected',
    };
  }

  const fileSizeInMB = file.size / 1024 / 1024;
  const fileExtension = file.name.split('.').pop();

  const fileType = file.type.split('/')[0];

  if (fileType === 'image' && type === 'pdf') {
    return {
      isOk: false,
      error: 'Invalid file type for the selected upload type',
    };
  }

  if (fileType === 'application' && type === 'image') {
    return {
      isOk: false,
      error: 'Invalid file type for the selected upload type',
    };
  }

  if (fileSizeInMB > MAX_SIZE_IN_MB) {
    return {
      isOk: false,
      error: `File size exceeds ${MAX_SIZE_IN_MB}MB`,
    };
  }

  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      isOk: false,
      error: `Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed`,
    };
  }

  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = () => {
      resolve({
        isOk: true,
        data: fileReader.result,
        type: fileType === 'image' ? 'image' : 'pdf',
      });
    };

    fileReader.onerror = () => {
      reject({
        isOk: false,
        error: 'Error reading file',
      });
    };

    fileReader.readAsDataURL(file);
  });
}

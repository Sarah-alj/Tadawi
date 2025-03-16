const MAX_SIZE_IN_MB = 5;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

export function handleFileUpload(file) {
  if (!file) {
    return {
      isOk: false,
      error: 'No file selected',
    };
  }

  const fileSizeInMB = file.size / 1024 / 1024;
  const fileExtension = file.name.split('.').pop();

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

export async function fetchData(url, signal) {
  try {
    const response = await fetch(url, { signal });
    const result = await response.json();

    if (response.ok) {
      return {
        isOk: true,
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        isOk: false,
        message: result.message,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      isOk: false,
      message: 'Network error occurred',
    };
  }
}

export async function postData(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      return {
        isOk: true,
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        isOk: false,
        message: result.message,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      isOk: false,
      message: 'Network error occurred',
    };
  }
}

export async function updateData(url, data) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      return {
        isOk: true,
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        isOk: false,
        message: result.message,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      isOk: false,
      message: 'Network error occurred',
    };
  }
}

export async function deleteData(url) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    const result = await response.json();

    if (response.ok) {
      return {
        isOk: true,
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        isOk: false,
        message: result.message,
        error: result.error,
      };
    }
  } catch (error) {
    return {
      isOk: false,
      message: 'Network error occurred',
    };
  }
}

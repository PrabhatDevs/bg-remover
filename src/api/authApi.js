import API from "./axios";

// CSRF
// const csrf = () => API.get("/sanctum/csrf-cookie");

// REGISTER USER
export const registerUser = async (data) => {
  try {
    const response = await API.post("/api/v1/register", data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const postToFirstAvailable = async (endpoints, data) => {
  const unique = Array.from(new Set(endpoints.filter(Boolean)));
  let lastError = null;

  for (const endpoint of unique) {
    try {
      const response = await API.post(endpoint, data);
      return response.data;
    } catch (error) {
      lastError = error;

      if (error?.response?.status === 404) {
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

export const verifyRegistrationOtp = async (data) => {
  try {
    const response = await API.post("/api/v1/verify-otp", data);
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendRegistrationOtp = async (data) => {
  try {
    const response = await API.post("/api/v1/resend-otp", data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// LOGIN
export const loginUser = async (data) => {
  try {
    const response = await API.post("/api/v1/login", data);
    const { access_token } = response.data;
    if (!access_token) {
      throw new Error("Token not received");
    }

    localStorage.setItem("token", access_token);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await API.post("/api/v1/password/forgot", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await API.post("/api/v1/password/reset", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Resend OTP for forgot password
export const resendForgotPasswordOtp = async (data) => {
  try {
    const response = await API.post("/api/v1/password/resend-otp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeBackgroundImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await API.post("/api/v1/remove-bg", formData);

  return response.data; // must contain job_id
};
export const checkStatus = async (jobId) => {
  const res = await API.get(`/api/v1/bg-remove-status/${jobId}`);
  return res.data;
};
export const pollForResult = async (jobId, interval = 2000, timeout = 60000) => {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const data = await checkStatus(jobId);

        if (data.status === "completed") {
          resolve(data);
          return;
        }

        if (data.status === "failed") {
          reject("Processing failed");
          return;
        }

        if (Date.now() - startTime > timeout) {
          reject("Timeout exceeded");
          return;
        }

        setTimeout(poll, interval);
      } catch (err) {
        reject(err);
      }
    };

    poll();
  });
};
export const logoutUser = async () => {
  try {
    const response = await API.post("/api/v1/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await API.get("/api/v1/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (data) => {
  try {
    const response = await API.put("/api/v1/user", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserPassword = async (data) => {
  try {
    const response = await API.put("/api/v1/user/password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserPhoto = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await API.post("/api/v1/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const response = await API.delete("/api/v1/user");
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getCurrentUser = async () => {
  const res = await API.get("/api/v1/user");
  return res.data;
};
// LOGIN
// export const loginUser = async (data) => {
//   await csrf();
//   return API.post("/api/v1/login", data);
// };

// FORGOT
// export const forgotPassword = async (data) => {
//   return API.post("/api/v1/forgot-password", data);
// };

// import API from "./axios";

// // ✅ CSRF helper
// const csrf = () => API.get("/sanctum/csrf-cookie");

// // REGISTER
// export const registerUser = async (data) => {
//   await csrf();
//   return API.post("/api/v1/register", data);
// };

// // LOGIN
// export const loginUser = async (data) => {
//   await csrf();
//   return API.post("/api/v1/login", data);
// };

// // FORGOT PASSWORD
// export const forgotPassword = async (data) => {
//   return API.post("/api/v1/forgot-password", data);
// };
// export const resetPassword = async (data) => {
//   return API.post("/api/v1/reset-password", data);
// };

// // LOGOUT
// export const logoutUser = async () => {
//   return API.post("/api/v1/logout");
// };

// // GET USER
// export const getUser = async () => {
//   return API.get("/api/v1/user");
// };

// // UPDATE USER
// export const updateUser = async (data) => {
//   return API.put("/api/v1/user", data);
// };

// // DELETE USER
// export const deleteUser = async () => {
//   return API.delete("/api/v1/user");
// };

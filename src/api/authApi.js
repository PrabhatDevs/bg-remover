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

  // Keep both keys to support backend field variations.
  formData.append("image", file);
  formData.append("image_file", file);

  try {
    const response = await API.post("/api/v1/remove-bg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    try {
      const fallbackResponse = await API.post("/remove-bg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      return fallbackResponse.data;
    } catch (fallbackError) {
      throw fallbackError;
    }
  }
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

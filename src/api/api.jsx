import axios from "axios";

const BASE_URL = "http://192.168.0.123:5000/api/admin/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Access token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Access token expired, attempting to refresh...');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("accessToken", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.clear();
        console.log(window.location.pathname);
        if (window.location.pathname !== "/application/login") {
          window.location.href = "/application/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden (User doesn't have permission)
    if (error.response?.status === 403) {
      console.error("Forbidden: You don't have permission to perform this action.");
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server error, please try again later.");
    }

    return Promise.reject(error);
  }
);



export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login_view/", { email, password });

    const { tokens } = response.data;
    if (tokens?.access) {
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password/', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/reset-password/${token}/`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
};

export const getUsers = async (status = null) => {
  try {
    const url = status ? `/getusers/?status=${status}` : "/getusers/";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getWebUsers = async () => {
  try {
    const response = await api.get("/getwebusers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching web users:", error);
    return [];
  }
};

export const saveUser = async (userData) => {
  try {
    const response = await api.post("/saveuser/", userData);
    return response.data;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const saveWebUser = async (userData) => {
  try {
    const response = await api.post("/savewebuser/", userData);
    return response.data;
  } catch (error) {
    console.error("Error saving web user:", error);
    throw error;
  }
};

// export const getSubscriptionDetail = async ({ userId = '', page = 1, perPage = 10, search = '', sortField = 'date', sortOrder = 'desc' }) => {
//   const url = `/get-all-subscription-detail/${userId}?page=${page}&per_page=${perPage}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`;
//   try {
//       const response = await api.get(url);
//       return response.data;
//   } catch (error) {
//       console.error("Error fetching subscription detail:", error);
//       return { results: [], count: 0 };
//   }
// };

export const getSubscriptionDetail = async ({
  userId,
  page,
  perPage,
  search,
  sortField,
  sortOrder
}) => {
  const response = await api.get(`/subscription-history/${userId}`, {
    params: {
      page,
      per_page: perPage,
      search,
      sortField,
      sortOrder
    }
  });
  return response.data;
};

export const getPlans = async () => {
  try {
    const response = await api.get("/plans/");
    return response.data;
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
};

export const getPlanById = async (id) => {
  try {
    const response = await api.get(`/plans/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching plan:", error);
    return null;
  }
};

export const savePlan = async (data, id = null) => {
  try {
    const url = id ? `/plans/${id}/` : `/plans/`;
    const method = id ? 'put' : 'post';

    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    console.error("Error saving plan:", error);
    throw error;
  }
};

export default api;
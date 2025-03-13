import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3030/auth";

// Add Axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage")); // Notify other components
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

// Async thunk for logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Optionally, call a logout endpoint if your backend supports it
      // await axios.post(`${BASE_URL}/logout`);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage")); // Notify other components
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BASE_URL}/profile`, config);
      // console.log("fetchUserProfile response:", response.data);
      return response.data;
    } catch (err) {
      localStorage.removeItem("token");
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
)

// Initial state
const initialState = {
  token: localStorage.getItem("accessToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous action to set user state from localStorage (e.g., on page refresh)
    setAuth: (state, action) => {
      state.isAuthenticated = true
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
      })
      // Fetch User Details
    .addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // Update the user details based on backend verification
    })
    .addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Fetching user details failed";
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user || action.payload;
      state.isAuthenticated = true;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })

  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
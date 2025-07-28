import { create } from "zustand";
import apiService from "../services/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await apiService.login(credentials);

      if (response.data?.user) {
        const user = {
          id: response.data.user._id,
          name: response.data.user.fullname,
          email: response.data.user.email,
          username: response.data.user.username,
          avatar: response.data.user.avatar,
          role: response.data.user.role || "user",
        };

        // Store access token in localStorage for header requests
        if (response.data.accessToken) {
          localStorage.setItem("authToken", response.data.accessToken);
        }

        set({ user, isAuthenticated: true, isLoading: false });
        return { success: true, user };
      }

      throw new Error("Login failed");
    } catch (error) {
      set({ isLoading: false });
      // Handle specific backend error messages
      let errorMessage = "Login failed";
      if (error.message.includes("User does not exist")) {
        errorMessage = "User not found. Please check your credentials.";
      } else if (error.message.includes("Invalid user credentials")) {
        errorMessage = "Invalid username or password.";
      } else if (error.message.includes("Account is deactivated")) {
        errorMessage =
          "Your account has been deactivated. Please contact admin.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  signup: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await apiService.register(userData);
      set({ isLoading: false });
      return {
        success: true,
        message: response.message || "Account created successfully!",
      };
    } catch (error) {
      set({ isLoading: false });
      // Handle specific backend error messages
      let errorMessage = "Signup failed";
      if (
        error.message.includes(
          "Username can only contain letters, numbers, and underscores"
        )
      ) {
        errorMessage =
          "Username can only contain letters, numbers, and underscores.";
      } else if (
        error.message.includes(
          "User with this email or username already exists"
        )
      ) {
        errorMessage = "An account with this email or username already exists.";
      } else if (error.message.includes("Password must be at least")) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("Full name is required")) {
        errorMessage = "Please enter your full name.";
      } else {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      // Call backend logout to clear cookies
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("authToken");
      set({ user: null, isAuthenticated: false });
    }
  },

  refreshAuth: async () => {
    try {
      const response = await apiService.refreshToken();

      if (response.data?.accessToken) {
        localStorage.setItem("authToken", response.data.accessToken);
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear auth state on refresh failure
      localStorage.removeItem("authToken");
      set({ user: null, isAuthenticated: false });
      return { success: false };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiService.getCurrentUser();

      if (response.data?.user) {
        const user = {
          id: response.data.user._id,
          name: response.data.user.fullname,
          email: response.data.user.email,
          username: response.data.user.username,
          avatar: response.data.user.avatar,
          role: response.data.user.role || "user",
        };

        set({ user, isAuthenticated: true });
        return { success: true, user };
      }

      return { success: false };
    } catch (error) {
      console.error("Get current user failed:", error);
      return { success: false };
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { isAuthenticated: false };
    }

    try {
      // Try to get current user
      const result = await get().getCurrentUser();
      if (result.success) {
        return { isAuthenticated: true };
      }

      // If failed, try to refresh token
      const refreshResult = await get().refreshAuth();
      if (refreshResult.success) {
        // Try to get current user again after refresh
        const userResult = await get().getCurrentUser();
        return { isAuthenticated: userResult.success };
      }

      return { isAuthenticated: false };
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("authToken");
      return { isAuthenticated: false };
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const { isAuthenticated } = await get().checkAuth();
      if (isAuthenticated) {
        // User is authenticated, get current user data
        await get().getCurrentUser();
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));

export default useAuthStore;

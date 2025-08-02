const API_BASE_URL = "http://localhost:3000/api/v1";
// const API_BASE_URL = "https://gajpati-backend.onrender.com/api/v1";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // This is crucial for cookies!
      ...options,
    };

    try {
      console.log(`🌐 Making request to: ${endpoint}`);
      const response = await fetch(url, config);

      // Handle different response statuses
      if (
        response.status === 401 &&
        !endpoint.includes("/refresh-token") &&
        !endpoint.includes("/login")
      ) {
        console.log("🔒 401 Unauthorized - attempting token refresh");

        // Try to refresh token
        if (!this.isRefreshing) {
          this.isRefreshing = true;

          try {
            const refreshResponse = await this.refreshToken();
            console.log("🔄 Refresh response:", refreshResponse);

            if (refreshResponse.success) {
              this.processQueue(null, "refreshed");

              // Retry the original request
              console.log("🔄 Retrying original request");
              const retryResponse = await fetch(url, config);

              if (!retryResponse.ok) {
                const retryErrorData = await retryResponse
                  .json()
                  .catch(() => ({}));
                throw new Error(
                  retryErrorData.message ||
                    `HTTP error! status: ${retryResponse.status}`
                );
              }

              return await retryResponse.json();
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            this.processQueue(refreshError, null);
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        } else {
          // Queue the request if already refreshing
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => {
            return fetch(url, config).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            });
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ Request failed:`, errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(`✅ Request successful:`, endpoint);
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    console.log("🔐 Attempting login...");
    return this.request("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    console.log("🚪 Logging out...");
    return this.request("/users/logout", {
      method: "POST",
    });
  }
  async refreshToken() {
    console.log("🔄 Refreshing token...");
    try {
      const response = await this.request("/users/refresh-token", {
        method: "POST",
      });
      return response;
    } catch (error) {
      console.error("❌ Refresh token request failed:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request("/users/me", {
        method: "GET",
      });
      return {
        success: true,
        data: response.data, // Ensure the backend returns { data: user }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Products endpoints (with FormData for file upload)
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/allProducts?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request("/products/create", {
      method: "POST",
      body: productData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: productData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async permanentDeleteProduct(id) {
    return this.request(`/products/permanent/${id}`, {
      method: "DELETE",
    });
  }

  async toggleProductStatus(id) {
    return this.request(`/products/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Plants endpoints
  async getPlants(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/plants/allPlants?${queryString}`);
  }

  async getPlant(id) {
    return this.request(`/plants/${id}`);
  }

  async createPlant(plantData) {
    return this.request("/plants/create", {
      method: "POST",
      body: JSON.stringify(plantData),
    });
  }

  async updatePlant(id, plantData) {
    return this.request(`/plants/${id}`, {
      method: "PUT",
      body: JSON.stringify(plantData),
    });
  }

  async deletePlant(id) {
    return this.request(`/plants/${id}`, {
      method: "DELETE",
    });
  }

  async permanentDeletePlant(id) {
    return this.request(`/plants/permanent/${id}`, {
      method: "DELETE",
    });
  }

  async togglePlantStatus(id) {
    return this.request(`/plants/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Natures endpoints (with FormData for image upload)
  async getNatures(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/natures/allNatures?${queryString}`);
  }

  async getNature(id) {
    return this.request(`/natures/${id}`);
  }

  async createNature(natureData) {
    return this.request("/natures/create", {
      method: "POST",
      body: natureData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async updateNature(id, natureData) {
    return this.request(`/natures/${id}`, {
      method: "PUT",
      body: natureData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async deleteNature(id) {
    return this.request(`/natures/${id}`, {
      method: "DELETE",
    });
  }

  async permanentDeleteNature(id) {
    return this.request(`/natures/permanent/${id}`, {
      method: "DELETE",
    });
  }

  async toggleNatureStatus(id) {
    return this.request(`/natures/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Blogs endpoints (with FormData for image upload)
  async getBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/blogs?${queryString}`);
  }

  async getBlog(id) {
    return this.request(`/blogs/${id}`);
  }

  async createBlog(blogData) {
    return this.request("/blogs/create", {
      method: "POST",
      body: blogData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async updateBlog(id, blogData) {
    return this.request(`/blogs/${id}`, {
      method: "PUT",
      body: blogData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async deleteBlog(id) {
    return this.request(`/blogs/${id}`, {
      method: "DELETE",
    });
  }

  // Inquiries endpoints
  async getInquiries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/inquires?${queryString}`);
  }

  async getInquiry(id) {
    return this.request(`/inquires/${id}`);
  }

  async createInquiry(inquiryData) {
    return this.request("/inquires", {
      method: "POST",
      body: JSON.stringify(inquiryData),
    });
  }

  async updateInquiry(id, inquiryData) {
    return this.request(`/inquires/${id}`, {
      method: "PUT",
      body: JSON.stringify(inquiryData),
    });
  }

  async deleteInquiry(id) {
    return this.request(`/inquires/${id}`, {
      method: "DELETE",
    });
  }

  // Quotes endpoints
  async getQuotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/quotes?${queryString}`);
  }

  async getQuote(id) {
    return this.request(`/quotes/${id}`);
  }

  async createQuote(quoteData) {
    return this.request("/quotes/create", {
      method: "POST",
      body: JSON.stringify(quoteData),
    });
  }

  async updateQuote(id, quoteData) {
    return this.request(`/quotes/${id}`, {
      method: "PUT",
      body: JSON.stringify(quoteData),
    });
  }

  async deleteQuote(id) {
    return this.request(`/quotes/${id}`, {
      method: "DELETE",
    });
  }

  // Subscribers endpoints
  async getSubscribers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/subscribers?${queryString}`);
  }

  async deleteSubscriber(id) {
    return this.request(`/subscribers/${id}`, {
      method: "DELETE",
    });
  }

  // Users endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Search products with filters (search, isActive, etc.)
  async searchProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/search?${queryString}`);
  }
}

export default new ApiService();

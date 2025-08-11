import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { redirect } from "react-router";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attaches the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles global errors like 401 and 403
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // const { logout } = useAuth();
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized: The user is not authenticated.
      if (status === 401) {
        // Clear the token and redirect to login.
        // logout();
        toast.error("Session expired. Please log in again.");
        redirect("/");
      }

      // 403 Forbidden: The user is authenticated but doesn't have permission.
      if (status === 403) {
        toast.error("You do not have permission to access this resource.");
        redirect("/unauthorized");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define a type for your error response
interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

// Create Axios instance with common configurations
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/rest/default/V1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// Toast ID to prevent duplicate toasts
let activeToastId: string | null = null;

// Add interceptors to handle requests and responses globally
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    if (!activeToastId) {
      activeToastId = 'requestError';
      toast.error('Failed to send the request. Please try again.', {
        position: 'top-right',
        toastId: activeToastId,
        onClose: () => {
          activeToastId = null; 
        },
      });
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      const errorMessage =
        data.message ||
        (status === 401
          ? `${localStorage.removeItem("authToken")}`
          : status === 403
          ? 'Access denied. You do not have the necessary permissions.'
          : status >= 500
          ? 'Server error! Please try again later.'
          : 'An error occurred!');

      if (!activeToastId) {
        activeToastId = `error-${status}`;
        toast.error(errorMessage, {
          position: 'top-right',
          toastId: activeToastId,
          onClose: () => {
            activeToastId = null; 
          },
        });
      }
    } else if (error.request) {
      if (!activeToastId) {
        activeToastId = 'noResponse';
        toast.error('No response from the server. Check your network connection.', {
          position: 'top-right',
          toastId: activeToastId,
          onClose: () => {
            activeToastId = null;
          },
        });
      }
    } else {
      if (!activeToastId) {
        activeToastId = 'unexpectedError';
        toast.error('An unexpected error occurred.', {
          position: 'top-right',
          toastId: activeToastId,
          onClose: () => {
            activeToastId = null;
          },
        });
      }
    }

    return Promise.reject(error);
  }
);

// Define utility functions for HTTP methods
const apiMethods = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.get(url, config);
  },
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.post(url, data, config);
  },
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.put(url, data, config);
  },
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.delete(url, config);
  },
};

// Export the enhanced Axios instance with methods
export default {
  ...api,
  ...apiMethods,
};

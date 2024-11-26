import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Create the base axios instance with common configurations
const api = axios.create({
  baseURL: 'https://beta.boffinbutler.com/rest/default/V1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Define utility functions for each HTTP method
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

export default {
  ...api,
  ...apiMethods,
};

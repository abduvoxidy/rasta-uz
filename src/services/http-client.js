import axios from "axios";
import toast from "react-hot-toast";
import { QueryClient } from "react-query";
import { getUser } from "utils/userDetails";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Platform: process.env.PLATFORM_ID,
  },
});

request.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user) {
      config.headers.Authorization = user.access_token;
    }
    return config;
  },

  (error) => errorHandler(error)
);

const errorHandler = (error) => {
  if (error && error.response) {
    //console.log(error.response.data)
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("login")) {
          location.replace("/login");
        }
      }
    }
    // if (error.response?.data?.Error) {
    //   toast.error(error.response.data.Error.Message, {
    //     position: "top-center",
    //   });
    // }
    // if (error.response?.data?.message) {
    //   toast.error(t(error.response.data.message))
    // }
  }

  return Promise.reject(error.response);
};

request.interceptors.response.use((response) => response.data, errorHandler);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

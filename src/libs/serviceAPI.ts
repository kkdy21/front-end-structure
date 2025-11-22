import type { AxiosError, AxiosInstance, CreateAxiosDefaults } from "axios";
import axios from "axios";
import { sessionStorageAccessor } from "@/libs/webStorage.ts";
import JwtProvider from "@/libs/jwtProvider.ts";

export default class ServiceAPI {
  instance: AxiosInstance;

  constructor(
    baseURL: string = import.meta.env.VITE_BACKEND_BASE_URL,
    settings: CreateAxiosDefaults = {}
  ) {
    this.instance = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
      ...settings,
      baseURL,
    });
    this.setAxiosInterceptors();
  }

  private setAxiosInterceptors(): void {
    this.instance.interceptors.request.use((request) => {
      if (typeof window !== "undefined") {
        const access_token =
          sessionStorageAccessor.getItem<string>("access_token");
        request.headers.Authorization = `Bearer ${access_token}`;
      }
      return request;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      this.handleResponseError
    );
  }

  private handleResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if ((originalRequest as any)._retry) {
        return Promise.reject(error);
      }
      (originalRequest as any)._retry = true;

      try {
        const refreshed = await JwtProvider.getProvider().refreshTokens();
        if (refreshed) {
          originalRequest!.headers.Authorization = `Bearer ${
            JwtProvider.getProvider().getTokens().access_token
          }`;
          return this.instance(originalRequest as any);
        }
      } catch (e) {
        console.debug(e);
        alert("User Session Expired.\n Pleas login again");
        //TODO login 화면으로 전환
        return Promise.reject(e);
      }
    }
  };
}

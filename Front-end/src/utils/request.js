import axios from "axios";
import { getToken } from "./storage";

export const baseUrl = "http://127.0.0.1/api/v1";

export const ajax = axios.create({
  baseURL: baseUrl,
});

ajax.interceptors.request.use(
  async config => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      return Promise.reject(err);
    }
    return config;
  },
  error => {
    console.log("拦截器错误", error);
    return Promise.reject(error);
  }
)


export default async function request (param = {}) {
  let url = `${baseUrl}${param.url}`;
  let method = param.method || "GET";
  let data = param.data || {};
  let needToken = param.needToken || false;
  let headers = param.headers || {"Content-Type": "application/json"};
  if (needToken) {
      headers = {...headers, "Authorization": `Bearer ${getToken()}`};
  }
  let options = {
      method: method,
      headers: headers,
  }
  if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") {
      options.body = data instanceof FormData ? data : JSON.stringify(data);
  }
  let response = await fetch(url, options);
  if (param.premitive) { return response; }
  let result = await response.json();
  return result;
};
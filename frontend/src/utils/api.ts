import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim();

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL must be set in the frontend environment.");
}

export const api = axios.create({
  baseURL: baseURL.replace(/\/+$/, ""),
  withCredentials: true,
});

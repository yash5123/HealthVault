import axios from "axios";

const API = axios.create({
  baseURL: "https://healthvault-o7bs.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    !req.url.includes("/auth/login") &&
    !req.url.includes("/auth/register")
  ) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  /* ⭐ IMPORTANT FIX FOR FILE UPLOADS */
  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  }

  return req;
});

export default API;
import axios from "axios";

export const instance = axios.create({
  baseURL: "https://catfact.ninja",
  timeout: 1000,
});

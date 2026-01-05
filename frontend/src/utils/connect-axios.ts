import axios from "axios";

export const serverAPI = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
})

export const serverAuth = axios.create({
  baseURL: "http://localhost:3000/auth",
  withCredentials: true
})
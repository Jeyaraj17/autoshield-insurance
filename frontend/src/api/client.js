import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8082",
  withCredentials: true,
});

export default client;

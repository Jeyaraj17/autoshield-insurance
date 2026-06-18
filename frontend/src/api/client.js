import axios from "axios";

const client = axios.create({
  baseURL: "https://autoshield-insurance.onrender.com",
  withCredentials: true,
});

export default client;

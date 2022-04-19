import { ENDPOINT } from "../index";
import axios from "axios";

export const login = async (data) => {
  const { staff_no, password } = data;
  return await axios.post(`${ENDPOINT.url}login`, { staff_no, password });
};

export const getUrl = async (data) => {
  const { staff_no } = data;
  return await axios.post(`${ENDPOINT.url}auth/link`, { staff_no });
};

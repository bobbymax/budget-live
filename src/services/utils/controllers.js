import { ENDPOINT } from "./index";
import authHeader from "./auth/auth.header";
import axios from "axios";

export const collection = async (entity) => {
  return await axios.get(`${ENDPOINT.url + entity}`, { headers: authHeader() });
};

export const bulk = async (entity, body) => {
  return await axios.post(`${ENDPOINT.url + entity}`, body, {
    headers: authHeader(),
  });
};

export const fetch = async (entity, id) => {
  return await axios.get(`${ENDPOINT.url + entity}/${id}`, {
    headers: authHeader(),
  });
};

export const store = async (entity, body) => {
  return await axios.post(`${ENDPOINT.url + entity}`, body, {
    headers: authHeader(),
  });
};

export const alter = async (entity, id, body) => {
  return await axios.patch(`${ENDPOINT.url + entity}/${id}`, body, {
    headers: authHeader(),
  });
};

export const destroy = async (entity, id) => {
  return await axios.delete(`${ENDPOINT.url + entity}/${id}`, {
    headers: authHeader(),
  });
};

export const batchRequests = async (...arrRequests) => {
  const result = await axios.all(...arrRequests);
  return Promise.resolve(result);
};

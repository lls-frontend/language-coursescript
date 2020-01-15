"use babel";

import axios from "axios";
import apiUrls from "./api-urls.js";

const parserRequest = axios.create({ baseURL: apiUrls.parse });
parserRequest.interceptors.response.use(
  res => res.data,
  error => {
    const { response } = error;
    const {
      data: { line, message },
      statusText
    } = response;
    const msg = message
      ? `${line ? `Line: ${line} ` : ""}${message}`
      : statusText;

    return Promise.reject(new Error(msg));
  }
);

const bffRequest = axios.create({ baseURL: apiUrls.bff });
bffRequest.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      return res.data.msg;
    }

    throw new Error(res.data.msg);
  },
  error => {
    const { response } = error;
    const { data, statusText } = response;

    return Promise.reject(new Error(data || statusText));
  }
);

const request = axios.create({ baseURL: apiUrls.asset });
request.interceptors.response.use(
  res => res.data.msg,
  error => {
    const {
      response: { data, statusText }
    } = error;

    return Promise.reject(new Error(data.msg || statusText));
  }
);

export { parserRequest, bffRequest, request };

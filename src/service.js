import axios from "axios";

const url = "https://geocloud.beredskabskort.dk/api/v2/sql/geo";
const key = "fbb2d411cfbc7b706c02359402afe195";

export const postData = (query) => {
  const payload = { q: query, key: key, allstr: "1" };
  return axios.post(url, payload);
};

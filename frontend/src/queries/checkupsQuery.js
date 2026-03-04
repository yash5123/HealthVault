import API from "../services/api";

export const fetchCheckups = async () => {
  const res = await API.get("/checkups");
  return res.data || [];
};
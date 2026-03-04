import API from "../services/api";

export const fetchMedicines = async () => {
  const res = await API.get("/medicines");
  return res.data || [];
};
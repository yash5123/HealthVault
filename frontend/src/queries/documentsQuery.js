import API from "../services/api";

export const fetchDocuments = async () => {
  const res = await API.get("/documents");
  return res.data || [];
};
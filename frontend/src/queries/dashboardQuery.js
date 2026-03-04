import API from "../services/api";

export const fetchDashboard = async () => {

  const [medRes, docRes, checkRes] = await Promise.all([
    API.get("/medicines"),
    API.get("/documents"),
    API.get("/checkups")
  ]);

  return {
    medicines: medRes.data || [],
    documents: docRes.data || [],
    checkups: checkRes.data || []
  };
};
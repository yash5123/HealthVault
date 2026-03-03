import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import API from "../services/api";

const MedicineContext = createContext();

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/medicines");
      setMedicines(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMedicine = async (data) => {
    await API.post("/medicines", data);
    fetchMedicines();
  };

  const updateMedicine = async (id, data) => {
    await API.put(`/medicines/${id}`, data);
    fetchMedicines();
  };

  const deleteMedicine = async (id) => {
    await API.delete(`/medicines/${id}`);
    fetchMedicines();
  };

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        loading,
        error,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        fetchMedicines,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export const useMedicines = () => useContext(MedicineContext);
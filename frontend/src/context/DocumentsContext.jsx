import { createContext, useContext, useEffect, useState, useMemo } from "react";
import API from "../services/api";

const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.log("Documents fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    await API.delete(`/documents/${id}`);
    fetchDocuments();
  };

  const filteredDocs = useMemo(() => {
    let data = [...documents];

    if (search) {
      data = data.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== "ALL") {
      data = data.filter((d) => d.type === filterType);
    }

    if (sort === "NEWEST") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sort === "A_Z") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

    return data;
  }, [documents, search, filterType, sort]);

  const stats = {
    total: documents.length,
    labReports: documents.filter((d) => d.type === "Lab Report").length,
    prescriptions: documents.filter((d) => d.type === "Prescription").length,
  };

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        filteredDocs,
        stats,
        search,
        setSearch,
        filterType,
        setFilterType,
        sort,
        setSort,
        fetchDocuments,
        deleteDocument,
        loading,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentsContext);
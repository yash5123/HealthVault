import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMedicines } from "../queries/medicinesQuery";
import SectionHeader from "../components/medicines/SectionHeader";
import StatsPanel from "../components/medicines/StatsPanel";
import MedicineForm from "../components/forms/MedicineForm";
import SearchPanel from "../components/medicines/SearchPanel";
import MedicineGrid from "../components/medicines/MedicineGrid";
import Modal from "../components/ui/Modal";

import API from "../services/api";
import "../styles/medicine.css";

export default function Medicines() {

  /* =====================================================
     STATE
  ====================================================== */

  const [editingMedicine, setEditingMedicine] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("NAME_ASC");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState(null);



  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);


  const queryClient = useQueryClient();

  const { data: medicines = [] } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
    staleTime: 1000 * 60 * 5
  });

  /* =====================================================
     CRUD OPERATIONS
  ====================================================== */

  const handleAdd = async (data) => {
    try {
      await API.post("/medicines", data);
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    } catch (err) {
      console.error("Add medicine error:", err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await API.put(`/medicines/${id}`, data);
      setEditingMedicine(null);
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    } catch (err) {
      console.error("Update medicine error:", err);
    }
  };


  const handleDelete = async (id) => {
    try {
      await API.delete(`/medicines/${id}`);

      queryClient.invalidateQueries({ queryKey: ["medicines"] });

      setMessage({
        type: "success",
        text: "Medicine deleted successfully"
      });

    } catch (err) {
      console.error("Delete medicine error:", err);

      setMessage({
        type: "error",
        text: "Failed to delete medicine"
      });
    }
  };

  /* =====================================================
     FILTER + SORT + SEARCH
  ====================================================== */

  const processedMedicines = useMemo(() => {

    let data = [...medicines];

    /* SEARCH */

    if (search) {
      const searchTerm = search.toLowerCase();

      data = data.filter((m) =>
        m.name.toLowerCase().includes(searchTerm)
      );
    }

    /* FILTER */

    if (filter !== "ALL") {

      data = data.filter((m) => {

        if (filter === "HEALTHY")
          return m.quantity > m.lowStockThreshold;

        if (filter === "LOW")
          return (
            m.quantity <= m.lowStockThreshold &&
            m.quantity > 0
          );

        if (filter === "CRITICAL")
          return m.quantity === 0;

        return true;

      });

    }

    /* SORT */

    if (sort === "NAME_ASC") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "LOW_FIRST") {
      data.sort((a, b) => a.quantity - b.quantity);
    }

    return data;

  }, [medicines, search, filter, sort]);

  /* =====================================================
     RENDER
  ====================================================== */

  return (

    <div className="page-medicines">
      <div className="page-content">
        {message && (
          <div className={`glass-toast ${message.type}`}>
            {message.type === "success" && "✔ "}
            {message.type === "error" && "⚠ "}
            {message.text}
          </div>
        )}

        <SectionHeader
          title="Medicines Management"
          subtitle="Track dosage, stock levels and smart consumption insights."
        />

        <StatsPanel medicines={medicines} />

        <MedicineForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          editingMedicine={editingMedicine}
          clearEdit={() => setEditingMedicine(null)}
        />

        <SearchPanel
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />

        <MedicineGrid
          medicines={processedMedicines}
          onEdit={(medicine) => setEditingMedicine(medicine)}
          onDelete={(id) => setDeleteTarget(id)}
        />

        <Modal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          title="Delete Medicine"
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => {
            if (!deleteTarget) return;

            handleDelete(deleteTarget);
            setDeleteTarget(null);
          }}
        >
          <p>
            Are you sure you want to delete this medicine?
            This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>

  );
}
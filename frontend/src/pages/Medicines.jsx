import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";

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

  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("NAME_ASC");

  const [deleteTarget, setDeleteTarget] = useState(null);

  /* =====================================================
     FETCH MEDICINES
  ====================================================== */

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get("/medicines");
      setMedicines(res.data);
    } catch (err) {
      console.error("Fetch medicines error:", err);
    }
  };

  /* =====================================================
     CRUD OPERATIONS
  ====================================================== */

  const handleAdd = async (data) => {
    try {
      await API.post("/medicines", data);
      fetchMedicines();
    } catch (err) {
      console.error("Add medicine error:", err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await API.put(`/medicines/${id}`, data);
      setEditingMedicine(null);
      fetchMedicines();
    } catch (err) {
      console.error("Update medicine error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      console.error("Delete medicine error:", err);
    }
  };

  /* =====================================================
     FILTER + SORT + SEARCH
  ====================================================== */

  const processedMedicines = useMemo(() => {
    let data = [...medicines];

    /* SEARCH */
    if (search) {
      data = data.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
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
    <Layout>
      <div className="page-medicines">

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
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            handleDelete(deleteTarget);
            setDeleteTarget(null);
          }}
          title="Delete Medicine"
          confirmText="Delete"
          variant="danger"
        >
          Are you sure you want to delete this medicine?
          This action cannot be undone.
        </Modal>

      </div>
    </Layout>
  );
}
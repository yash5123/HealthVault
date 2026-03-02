import { useEffect, useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

/* =====================================================
   HELPER COMPONENTS
===================================================== */

const SectionTitle = ({ title, subtitle }) => (
  <div style={{ marginBottom: 25 }}>
    <h2 style={{ margin: 0, fontSize: 26 }}>
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          margin: "6px 0 0",
          color: "#64748b",
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    HEALTHY: "#16a34a",
    LOW: "#f59e0b",
    CRITICAL: "#ef4444",
  };

  const bg = {
    HEALTHY: "#dcfce7",
    LOW: "#fef3c7",
    CRITICAL: "#fee2e2",
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: bg[status],
        color: colors[status],
      }}
    >
      {status}
    </span>
  );
};

/* =====================================================
   DELETE MODAL
===================================================== */

const DeleteModal = ({
  visible,
  onClose,
  onConfirm,
  medicineName,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 16,
          width: 400,
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.15)",
        }}
      >
        <h3>Delete Medicine</h3>
        <p>
          Are you sure you want to delete{" "}
          <strong>{medicineName}</strong>?
        </p>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            style={{
              background: "#e2e8f0",
              color: "#1e293b",
            }}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="danger-btn"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Medicines() {

  /* =====================================================
     STATE
  ===================================================== */

  const [medicines, setMedicines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("NAME_ASC");

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [formErrors, setFormErrors] =
    useState({});

  const [form, setForm] = useState({
    name: "",
    dosageAmount: "",
    dosageUnit: "mg",
    frequencyPerDay: "",
    durationDays: "",
    quantity: "",
    lowStockThreshold: 5,
  });

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const res =
      await API.get("/api/medicines");
    setMedicines(res.data);
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    const errors = {};

    if (!form.name)
      errors.name = "Required";

    if (!form.dosageAmount)
      errors.dosageAmount =
        "Required";

    if (!form.frequencyPerDay)
      errors.frequencyPerDay =
        "Required";

    if (!form.durationDays)
      errors.durationDays =
        "Required";

    if (!form.quantity)
      errors.quantity = "Required";

    setFormErrors(errors);

    return Object.keys(errors).length ===
      0;
  };

  /* =====================================================
     SMART CALCULATIONS
  ===================================================== */

  const totalRequired =
    (form.frequencyPerDay || 0) *
    (form.durationDays || 0);

  const daysRemaining = (med) => {
    if (!med.frequencyPerDay)
      return 0;
    return Math.floor(
      med.quantity /
      med.frequencyPerDay
    );
  };

  const getStatus = (med) => {
    if (med.quantity === 0)
      return "CRITICAL";
    if (
      med.quantity <=
      med.lowStockThreshold
    )
      return "LOW";
    return "HEALTHY";
  };

  /* =====================================================
     CRUD OPERATIONS
  ===================================================== */

  const handleAdd = async () => {
    if (!validateForm()) return;

    await API.post("/api/medicines", {
      ...form,
      totalRequired,
    });

    resetForm();
    fetchMedicines();
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    await API.put(
      `/api/medicines/${editingId}`,
      {
        ...form,
        totalRequired,
      }
    );

    resetForm();
    fetchMedicines();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    await API.delete(
      `/api/medicines/${deleteTarget._id}`
    );

    setDeleteTarget(null);
    fetchMedicines();
  };

  const resetForm = () => {
    setForm({
      name: "",
      dosageAmount: "",
      dosageUnit: "mg",
      frequencyPerDay: "",
      durationDays: "",
      quantity: "",
      lowStockThreshold: 5,
    });
    setEditingId(null);
    setFormErrors({});
  };

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const processedData = useMemo(() => {
    let data = [...medicines];

    if (search) {
      data = data.filter((m) =>
        m.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (filter !== "ALL") {
      data = data.filter(
        (m) => getStatus(m) === filter
      );
    }

    if (sort === "NAME_ASC") {
      data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "LOW_FIRST") {
      data.sort(
        (a, b) =>
          a.quantity - b.quantity
      );
    }

    return data;
  }, [medicines, search, filter, sort]);

  /* =====================================================
     SUMMARY STATS
  ===================================================== */

  const totalMedicines =
    medicines.length;

  const lowCount = medicines.filter(
    (m) => getStatus(m) === "LOW"
  ).length;

  const criticalCount =
    medicines.filter(
      (m) =>
        getStatus(m) === "CRITICAL"
    ).length;

  /* =====================================================
     RETURN UI
  ===================================================== */

  return (
    <Layout>

      <DeleteModal
        visible={!!deleteTarget}
        medicineName={
          deleteTarget?.name
        }
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
      />

      <SectionTitle
        title="Medicines Management"
        subtitle="Track dosage, frequency, stock levels and smart consumption insights."
      />

      {/* ================= SUMMARY CARDS ================= */}

      <div className="grid">

        <div className="card dashboard-card">
          <h3>Total Medicines</h3>
          <p>{totalMedicines}</p>
        </div>

        <div className="card dashboard-card warning">
          <h3>Low Stock</h3>
          <p>{lowCount}</p>
        </div>

        <div className="card dashboard-card danger">
          <h3>Critical</h3>
          <p>{criticalCount}</p>
        </div>

      </div>

      {/* ================= FORM SECTION ================= */}

      <div
        className="card"
        style={{
          marginTop: 40,
          border:
            editingId &&
            "2px solid #8b5cf6",
        }}
      >

        <h3 style={{ marginBottom: 25 }}>
          {editingId
            ? "Edit Medicine"
            : "Add New Medicine"}
        </h3>

        <div className="grid">

          {/* NAME */}
          <div>
            <input
              placeholder="Medicine Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value,
                })
              }
            />
            {formErrors.name && (
              <small
                style={{
                  color: "red",
                }}
              >
                {formErrors.name}
              </small>
            )}
          </div>

          {/* DOSAGE */}
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="Dosage"
                value={
                  form.dosageAmount
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    dosageAmount:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
              {formErrors.dosageAmount && (
                <small
                  style={{
                    color: "red",
                  }}
                >
                  {
                    formErrors.dosageAmount
                  }
                </small>
              )}
            </div>

            <select
              value={form.dosageUnit}
              onChange={(e) =>
                setForm({
                  ...form,
                  dosageUnit:
                    e.target.value,
                })
              }
              style={{
                borderRadius: 10,
                padding: "10px",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <option value="mg">
                mg
              </option>
              <option value="ml">
                ml
              </option>
              <option value="tablet">
                tablet
              </option>
              <option value="capsule">
                capsule
              </option>
            </select>
          </div>

          {/* FREQUENCY */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="Times per day"
                value={
                  form.frequencyPerDay
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    frequencyPerDay:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
              {formErrors.frequencyPerDay && (
                <small
                  style={{
                    color: "red",
                  }}
                >
                  {
                    formErrors.frequencyPerDay
                  }
                </small>
              )}
            </div>

            <span>
              times/day
            </span>
          </div>

          {/* DURATION */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="Duration"
                value={
                  form.durationDays
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationDays:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
              {formErrors.durationDays && (
                <small
                  style={{
                    color: "red",
                  }}
                >
                  {
                    formErrors.durationDays
                  }
                </small>
              )}
            </div>

            <span>days</span>
          </div>

          {/* QUANTITY */}
          <div>
            <input
              type="number"
              placeholder="Available Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
            {formErrors.quantity && (
              <small
                style={{
                  color: "red",
                }}
              >
                {formErrors.quantity}
              </small>
            )}
          </div>

          {/* LOW STOCK THRESHOLD */}
          <input
            type="number"
            placeholder="Low Stock Threshold"
            value={
              form.lowStockThreshold
            }
            onChange={(e) =>
              setForm({
                ...form,
                lowStockThreshold:
                  Number(
                    e.target.value
                  ),
              })
            }
          />

        </div>

        {/* SMART PREVIEW PANEL */}

        <div
          style={{
            marginTop: 30,
            padding: 20,
            background:
              "linear-gradient(135deg,#eef2ff,#f8fafc)",
            borderRadius: 14,
          }}
        >
          <strong>
            Smart Calculation Preview
          </strong>

          <p>
            Total Required:{" "}
            <strong>
              {totalRequired}
            </strong>{" "}
            units
          </p>

          {form.quantity &&
            form.frequencyPerDay && (
              <p>
                Estimated Days Remaining:{" "}
                <strong>
                  {Math.floor(
                    form.quantity /
                    form.frequencyPerDay
                  )}
                </strong>
              </p>
            )}
        </div>

        {/* ACTION BUTTONS */}

        <div
          style={{
            marginTop: 25,
            display: "flex",
            gap: 12,
          }}
        >
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
              >
                Update Medicine
              </button>

              <button
                style={{
                  background:
                    "#e2e8f0",
                  color:
                    "#1e293b",
                }}
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
            >
              Add Medicine
            </button>
          )}
        </div>

      </div>
      {/* ================= SEARCH + FILTER ================= */}

      <div
        className="card"
        style={{ marginTop: 40 }}
      >
        <div className="grid">

          <input
            placeholder="Search medicine..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            style={{
              padding: 10,
              borderRadius: 10,
              border:
                "1px solid #e2e8f0",
            }}
          >
            <option value="ALL">
              All
            </option>
            <option value="HEALTHY">
              Healthy
            </option>
            <option value="LOW">
              Low
            </option>
            <option value="CRITICAL">
              Critical
            </option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            style={{
              padding: 10,
              borderRadius: 10,
              border:
                "1px solid #e2e8f0",
            }}
          >
            <option value="NAME_ASC">
              A-Z
            </option>
            <option value="LOW_FIRST">
              Lowest Stock
            </option>
          </select>

        </div>
      </div>

      {/* ================= MEDICINE LIST ================= */}

      <div style={{ marginTop: 40 }}>

        {processedData.length === 0 && (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: 60,
            }}
          >
            <h3>No Medicines Found</h3>
            <p style={{ color: "#64748b" }}>
              Add your first medicine to
              start tracking dosage and
              stock.
            </p>
          </div>
        )}

        <div className="grid">

          {processedData.map((med) => {

            const status =
              getStatus(med);

            const remaining =
              daysRemaining(med);

            const percent =
              (med.quantity /
                med.lowStockThreshold) *
              100;

            return (
              <div
                key={med._id}
                className="card medicine-card"
                style={{
                  borderLeft:
                    status ===
                      "CRITICAL"
                      ? "6px solid #ef4444"
                      : status === "LOW"
                        ? "6px solid #f59e0b"
                        : "6px solid #16a34a",
                }}
              >
                {/* HEADER */}
                <div className="medicine-header">
                  <h3>
                    {med.name}
                  </h3>

                  <StatusBadge
                    status={status}
                  />
                </div>

                {/* DETAILS */}
                <div className="medicine-details">

                  <div>
                    <label>
                      Dosage
                    </label>
                    <p>
                      {
                        med.dosageAmount
                      }{" "}
                      {
                        med.dosageUnit
                      }
                    </p>
                  </div>

                  <div>
                    <label>
                      Frequency
                    </label>
                    <p>
                      {
                        med.frequencyPerDay
                      }{" "}
                      times/day
                    </p>
                  </div>

                  <div>
                    <label>
                      Duration
                    </label>
                    <p>
                      {
                        med.durationDays
                      }{" "}
                      days
                    </p>
                  </div>

                  <div>
                    <label>
                      Quantity
                    </label>
                    <p>
                      {med.quantity}
                    </p>
                  </div>

                </div>

                {/* PROGRESS BAR */}
                <div className="progress-container">
                  <div
                    className={
                      status ===
                        "CRITICAL"
                        ? "progress-bar progress-danger"
                        : "progress-bar"
                    }
                    style={{
                      width: `${Math.min(
                        percent,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color:
                      "#64748b",
                  }}
                >
                  Est. Days Remaining:{" "}
                  <strong>
                    {remaining}
                  </strong>
                </p>

                {/* ACTIONS */}
                <div
                  className="medicine-actions"
                  style={{
                    marginTop: 15,
                    gap: 8,
                  }}
                >

                  <button
                    onClick={() =>
                      setForm(med) ||
                      setEditingId(
                        med._id
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() =>
                      setDeleteTarget(
                        med
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      </div>

    </Layout>
  );
}
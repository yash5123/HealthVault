import { useState, useEffect, useMemo } from "react";

export default function MedicineForm({
  onAdd,
  onUpdate,
  editingMedicine,
  clearEdit,
}) {
  /* ================= STATE ================= */

  const [form, setForm] = useState({
    name: "",
    dosageAmount: "",
    dosageUnit: "mg",
    frequencyPerDay: "",
    durationDays: "",
    quantity: "",
    lowStockThreshold: 5,
  });

  const [errors, setErrors] = useState({});

  /* ================= EDIT MODE LOAD ================= */

  useEffect(() => {
    if (editingMedicine) {
      setForm({
        name: editingMedicine.name || "",
        dosageAmount: editingMedicine.dosageAmount || "",
        dosageUnit: editingMedicine.dosageUnit || "mg",
        frequencyPerDay: editingMedicine.frequencyPerDay || "",
        durationDays: editingMedicine.durationDays || "",
        quantity: editingMedicine.quantity || "",
        lowStockThreshold:
          editingMedicine.lowStockThreshold || 5,
      });
    }
  }, [editingMedicine]);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim())
      newErrors.name = "Medicine name is required";

    if (!form.dosageAmount)
      newErrors.dosageAmount = "Required";

    if (!form.frequencyPerDay)
      newErrors.frequencyPerDay = "Required";

    if (!form.durationDays)
      newErrors.durationDays = "Required";

    if (!form.quantity)
      newErrors.quantity = "Required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SMART CALCULATIONS ================= */

  const totalRequired = useMemo(() => {
    return (
      (Number(form.frequencyPerDay) || 0) *
      (Number(form.durationDays) || 0)
    );
  }, [form.frequencyPerDay, form.durationDays]);

  const estimatedDaysRemaining = useMemo(() => {
    if (!form.frequencyPerDay || !form.quantity)
      return 0;

    return Math.floor(
      Number(form.quantity) /
      Number(form.frequencyPerDay)
    );
  }, [form.quantity, form.frequencyPerDay]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      ...form,
      totalRequired,
    };

    if (editingMedicine) {
      onUpdate(editingMedicine._id, payload);
      clearEdit();
    } else {
      onAdd(payload);
    }

    resetForm();
  };

  /* ================= RESET ================= */

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
    setErrors({});
  };

  /* ================= RENDER ================= */

  return (
    <div className="card form-card">
      <h3 className="section-title">
        {editingMedicine
          ? "Edit Medicine"
          : "Add New Medicine"}
      </h3>

      <div className="form-grid">

        {/* NAME */}
        <div className="field">
          <label>Medicine Name</label>
          <input
            className="input"
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
          {errors.name && (
            <span className="error">
              {errors.name}
            </span>
          )}
        </div>

        {/* DOSAGE */}
        <div className="field">
          <label>Dosage</label>
          <div className="inline-group">
            <input
              className="input"
              type="number"
              value={form.dosageAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  dosageAmount:
                    Number(e.target.value),
                })
              }
            />

            <select
              className="select"
              value={form.dosageUnit}
              onChange={(e) =>
                setForm({
                  ...form,
                  dosageUnit:
                    e.target.value,
                })
              }
            >
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="tablet">
                tablet
              </option>
              <option value="capsule">
                capsule
              </option>
            </select>
          </div>
          {errors.dosageAmount && (
            <span className="error">
              {errors.dosageAmount}
            </span>
          )}
        </div>

        {/* FREQUENCY */}
        <div className="field">
          <label>Frequency</label>
          <div className="inline-group">
            <input
              className="input"
              type="number"
              value={form.frequencyPerDay}
              onChange={(e) =>
                setForm({
                  ...form,
                  frequencyPerDay:
                    Number(e.target.value),
                })
              }
            />
            <div className="inline-text">
              times/day
            </div>
          </div>
          {errors.frequencyPerDay && (
            <span className="error">
              {errors.frequencyPerDay}
            </span>
          )}
        </div>

        {/* DURATION */}
        <div className="field">
          <label>Duration</label>
          <div className="inline-group">
            <input
              className="input"
              type="number"
              value={form.durationDays}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationDays:
                    Number(e.target.value),
                })
              }
            />
            <div className="inline-text">
              days
            </div>
          </div>
          {errors.durationDays && (
            <span className="error">
              {errors.durationDays}
            </span>
          )}
        </div>

        {/* QUANTITY */}
        <div className="field">
          <label>Available Quantity</label>
          <input
            className="input"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity:
                  Number(e.target.value),
              })
            }
          />
          {errors.quantity && (
            <span className="error">
              {errors.quantity}
            </span>
          )}
        </div>

        {/* LOW STOCK */}
        <div className="field">
          <label>Low Stock Alert At</label>
          <input
            className="input"
            type="number"
            value={form.lowStockThreshold}
            onChange={(e) =>
              setForm({
                ...form,
                lowStockThreshold:
                  Number(e.target.value),
              })
            }
          />
          <small className="helper">
            You will be notified when stock
            drops below this number.
          </small>
        </div>

      </div>

      {/* SMART PREVIEW */}

      <div className="smart-box">
        <h4>Smart Calculation</h4>
        <p>
          Total Required:{" "}
          <strong>{totalRequired}</strong> units
        </p>
        <p>
          Estimated Days Remaining:{" "}
          <strong>
            {estimatedDaysRemaining}
          </strong>
        </p>
      </div>

      {/* ACTIONS */}

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          {editingMedicine
            ? "Update Medicine"
            : "Add Medicine"}
        </button>

        {editingMedicine && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              clearEdit();
              resetForm();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
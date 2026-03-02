require("dns").setDefaultResultOrder("verbatim");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

/* ================= CONNECT DATABASE ================= */
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/checkups", require("./routes/checkupRoutes"));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("HealthVault API Running 🚀");
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
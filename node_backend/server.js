const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables


const emailRoutes = require("./src/routes/emailRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---

app.use("/api/payment", paymentRoutes);
app.use("/api/email",emailRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

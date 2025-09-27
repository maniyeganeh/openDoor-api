import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"
import authRoutes from "./routes/authRotes.js"
import requestRoutes from "./routes/requestRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import visitRoutes from "./routes/visitRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"


dotenv.config();
const app = express();
app.use(bodyParser.json())
app.use(express.json())

app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes)
app.use("/api/request", requestRoutes)
app.use("/api/projcets", projectRoutes)
app.use("/api/visits", visitRoutes)
app.use("/api/admin", adminRoutes)


const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });
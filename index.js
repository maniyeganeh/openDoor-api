import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"
import authRoutes from "./routes/authRotes.js"

dotenv.config();
const app = express();
app.use(bodyParser.json())
app.use(express.json())

app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes)
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
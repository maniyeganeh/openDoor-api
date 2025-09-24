// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    developer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, enum: ["economy", "vip"], default: "economy" },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);

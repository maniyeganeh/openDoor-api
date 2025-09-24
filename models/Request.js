// models/Request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    consultant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    customerName: { type: String, required: true },
    businessField: { type: String },
    type: { type: String, enum: ["rent", "buy"], required: true },
    payment: { type: String, enum: ["cash", "installment", "barter"], required: true },
    budget: { type: Number, required: true },
    area: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);

// models/Visit.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    consultant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g. "10:00 - 11:00"
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    feedback: { type: String }, // developer feedback about consultant
    rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

export default mongoose.model("Visit", visitSchema);

import User from "../models/User.js";
import Project from "../models/Project.js";
import Request from "../models/Request.js";
import Visit from "../models/Visit.js";

// ------------------- Users -------------------
// وریفای مشاور
export const verifyConsultant = async (req, res) => {
    try {
        const { consultantId } = req.params;
        const user = await User.findById(consultantId);
        if (!user || user.role !== "consultant") return res.status(404).json({ message: "Not found" });

        user.isVerified = true;
        await user.save();
        res.json({ message: "Consultant verified", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const verifyDeveloper = async (req, res) => {
    try {
        const { developerId } = req.params;
        const user = await User.findById(developerId);
        if (!user || user.role !== "developer") return res.status(404).json({ message: "Not found" });

        user.isVerified = true;
        await user.save();
        res.json({ message: "Developer verified", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// لیست همه کاربران
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// حذف کاربر
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- Projects -------------------
export const createProject = async (req, res) => {
    try {
        const { developer, name, address, category, description } = req.body;
        const project = new Project({ developer, name, address, category, description });
        await project.save();
        res.status(201).json({ message: "Project created", project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByIdAndUpdate(projectId, req.body, { new: true });
        res.json({ message: "Project updated", project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        await Project.findByIdAndDelete(projectId);
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- Requests -------------------
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate("consultant project");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- Visits -------------------
export const getAllVisits = async (req, res) => {
    try {
        const visits = await Visit.find().populate("consultant developer project request");
        res.json(visits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

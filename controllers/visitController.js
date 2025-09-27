import Visit from "../models/Visit.js";
import Project from "../models/Project.js";
import Request from "../models/Request.js";


export const createVisit = async (req, res) => {
    try {
        const consultantId = req.user.id;
        const { project, developer, request, date, timeSlot } = req.body;

        if (!project || !developer || !request || !date || !timeSlot) {
            return res.status(400).json({ message: "لطفاً همه فیلدهای ضروری را پر کنید" });
        }


        const projectExists = await Project.findById(project);
        if (!projectExists) return res.status(404).json({ message: "پروژه یافت نشد" });

        const requestExists = await Request.findById(request);
        if (!requestExists) return res.status(404).json({ message: "درخواست یافت نشد" });

        const newVisit = new Visit({
            project,
            consultant: consultantId,
            developer,
            request,
            date,
            timeSlot,
        });

        await newVisit.save();
        res.status(201).json({ message: "بازدید ثبت شد", visit: newVisit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getVisitsForConsultant = async (req, res) => {
    try {
        const consultantId = req.user.id;
        const visits = await Visit.find({ consultant: consultantId })
            .populate("project")
            .populate("developer")
            .populate("request");
        res.json(visits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getVisitsForDeveloper = async (req, res) => {
    try {
        const developerId = req.user.id;
        const visits = await Visit.find({ developer: developerId })
            .populate("project")
            .populate("consultant")
            .populate("request");
        res.json(visits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const updateVisitStatus = async (req, res) => {
    try {
        const { visitId } = req.params;
        const { status, feedback, rating } = req.body;

        const visit = await Visit.findById(visitId).populate("developer");
        if (!visit) return res.status(404).json({ message: "بازدید یافت نشد" });

        if (visit.developer._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "شما اجازه تغییر این بازدید را ندارید" });
        }

        if (status && !["scheduled", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "وضعیت معتبر نیست" });
        }

        if (status) visit.status = status;
        if (feedback) visit.feedback = feedback;
        if (rating) visit.rating = rating;

        await visit.save();
        res.json({ message: "بازدید به‌روزرسانی شد", visit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

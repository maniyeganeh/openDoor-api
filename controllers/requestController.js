import Request from "../models/Request.js";
import Project from "../models/Project.js";

export const createRequest = async (req, res) => {
    try {
        const consultantId = req.user.id;
        const {
            project,
            customerName,
            businessField,
            type,
            payment,
            budget,
            area
        } = req.body;

        if (!project || !customerName || !type || !payment || !budget || !area) {
            return res.status(400).json({ message: "لطفاً همه فیلدهای ضروری را پر کنید" });
        }


        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ message: "پروژه یافت نشد" });
        }

        const newRequest = new Request({
            consultant: consultantId,
            project,
            customerName,
            businessField,
            type,
            payment,
            budget,
            area,
        });

        await newRequest.save();

        res.status(201).json({
            message: "درخواست با موفقیت ثبت شد",
            request: newRequest,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRequestsForConsultant = async (req, res) => {


    try {
        const consultantId = req.user._id;
        const requests = await Request.find({ consultant: consultantId }).populate("project");


        return res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getRequestsForDeveloper = async (req, res) => {
    try {
        const developerId = req.user.id;
        const requests = await Request.find()
            .populate({
                path: "project",
                match: { developer: developerId },
            })
            .populate("consultant");


        const filtered = requests.filter((r) => r.project !== null);

        res.json(filtered);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "وضعیت معتبر نیست" });
        }

        const request = await Request.findById(requestId).populate("project");

        if (!request) {
            return res.status(404).json({ message: "درخواست یافت نشد" });
        }


        if (request.project.developer.toString() !== req.user.id) {
            return res.status(403).json({ message: "شما اجازه تغییر این درخواست را ندارید" });
        }

        request.status = status;
        await request.save();

        res.json({ message: "وضعیت درخواست تغییر کرد", request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
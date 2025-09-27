import Project from "../models/Project.js";


export const createProject = async (req, res) => {
    try {
        const developerId = req.user.id;
        const { name, address, category, description } = req.body;

        if (!name || !address) {
            return res.status(400).json({ message: "نام و آدرس پروژه الزامی است" });
        }


        if (req.user.role !== "developer") {
            return res.status(403).json({ message: "فقط سازنده می‌تواند پروژه ایجاد کند" });
        }

        const newProject = new Project({
            developer: developerId,
            name,
            address,
            category,
            description,
        });

        await newProject.save();

        res.status(201).json({
            message: "پروژه با موفقیت ثبت شد",
            project: newProject,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("developer", "name email");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getMyProjects = async (req, res) => {
    try {
        if (req.user.role !== "developer") {
            return res.status(403).json({ message: "فقط سازنده می‌تواند پروژه‌های خودش را ببیند" });
        }

        const projects = await Project.find({ developer: req.user.id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("developer", "name email");
        if (!project) {
            return res.status(404).json({ message: "پروژه یافت نشد" });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "پروژه یافت نشد" });
        }

        if (project.developer.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "شما اجازه ویرایش این پروژه را ندارید" });
        }

        Object.assign(project, req.body);
        await project.save();

        res.json({ message: "پروژه با موفقیت ویرایش شد", project });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "پروژه یافت نشد" });
        }

        if (project.developer.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "شما اجازه حذف این پروژه را ندارید" });
        }

        await project.deleteOne();
        res.json({ message: "پروژه با موفقیت حذف شد" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

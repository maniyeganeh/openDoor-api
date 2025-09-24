import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken"
// REGISTER
export const register = async (req, res) => {
    try {
        const {
            role,
            name,
            email,
            password,

            // مشاور املاک
            mobile,
            agencyPhone,
            agencyName,
            address,
            instagramPage,
            businessCard,

            // سازنده
            projectName,
            projectAddress,
            developerPhone,
            developerInsta,
            needInstaSupport,
        } = req.body;

        if (!role || !password) {
            return res.status(400).json({ message: "Role and password are required" });
        }


        if (email) {
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "User already exists" });
            }
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        let newUser;

        if (role === "consultant") {
            if (!mobile || !agencyName) {
                return res
                    .status(400)
                    .json({ message: "مشاور املاک باید موبایل و نام آژانس داشته باشد" });
            }

            newUser = new User({
                role,
                password: hashedPassword,
                mobile,
                agencyPhone,
                agencyName,
                address,
                instagramPage,
                businessCard,
                isVerified: false, // باید ادمین تأیید کنه
            });
        }

        if (role === "developer") {
            if (!name || !developerPhone) {
                return res
                    .status(400)
                    .json({ message: "سازنده باید نام و شماره تماس داشته باشد" });
            }

            newUser = new User({
                role,
                name,
                password: hashedPassword,
                developerPhone,
                developerInsta,
                needInstaSupport,
                projectName,
                projectAddress,
                isVerified: false,
            });
        }

        if (role === "admin") {
            if (!email) {
                return res.status(400).json({ message: "ادمین باید ایمیل داشته باشد" });
            }

            newUser = new User({
                role,
                name,
                email,
                password: hashedPassword,
                isVerified: true,
            });
        }

        if (!newUser) {
            return res.status(400).json({ message: "Role not recognized" });
        }

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully, pending admin approval if needed",
            user: {
                id: newUser._id,
                role: newUser.role,
                name: newUser.name,
                email: newUser.email,
                isVerified: newUser.isVerified,
            },
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: err.message });
    }
};
export const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Email/Phone and password are required" });
        }


        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { mobile: emailOrPhone }, { developerPhone: emailOrPhone }],
        }).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if ((user.role === "consultant" || user.role === "developer") && !user.isVerified) {
            console.log("Error");

            return res
                .status(403)
                .json({ message: "Your account is not verified by admin yet" });
        }


        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
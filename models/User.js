import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["consultant", "developer", "admin"], // مشاور املاک / سازنده / ادمین
            required: true,
        },

        name: { type: String, required: false },
        email: { type: String, unique: true, sparse: true },
        password: { type: String, required: true, select: false },


        mobile: String,
        agencyPhone: String,
        agencyName: String,
        address: String,
        instagramPage: String,
        businessCard: String,
        isVIP: { type: Boolean, default: false },


        projectName: String,
        projectAddress: String,
        developerPhone: String,
        developerInsta: String,
        needInstaSupport: { type: Boolean, default: false }, // اگر اینستاگرام نداشت تیک بزنه


        isVerified: { type: Boolean, default: false }, // بعد از تأیید ادمین true میشه
        warnings: { type: Number, default: 0 }, // تعداد اخطارها برای مشاور
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);

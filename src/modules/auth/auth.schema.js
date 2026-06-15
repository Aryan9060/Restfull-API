import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        required: [true, "Name is required"]
    },
    
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"]
    },

    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: [true, "Password is required"],
        select: false
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    varificationToken: {
        type: String,
        default: '',
        select: false
    },
    refreshToken: {
        type: String,
        default: '',
        select: false
    },
    resetPasswordToken: {
        type: String,
        default: '',
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
        select: false
    }

}, { timestamps: true })

export default mongoose.model("User", userSchema);
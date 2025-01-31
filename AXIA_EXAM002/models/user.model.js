import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: { type: String, require: true, },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    age: { type: Number, require: true },
    isAdmin: { type: Boolean, require: true, default: false },
}, { timestamps: true });


const userModel = mongoose.model("exam002_Users", userSchema);

export default userModel
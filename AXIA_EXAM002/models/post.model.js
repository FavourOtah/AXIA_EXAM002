import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {},
    description: {},
    previewPix: {},
    detailedVideo: {},
    creatorId: {},
}, { timestamp: true });

const postModel = mongoose.model("exam002_posts", postSchema)

export default postModel
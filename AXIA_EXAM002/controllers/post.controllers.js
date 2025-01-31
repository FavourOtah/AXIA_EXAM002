import postModel from "../models/post.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const createPost = async (req, res) => {
    try {
        //the logic here is that only someone that logged in is permitted to create a post
        //this req.user.id is passed on from the authorization middleware
        const userId = req.user.id;

        //checking to see the user is logged by checking for the availability of a payload containg user id(userId) from the token
        if (!userId) {
            return res.status(401).json({ message: "User must be logged in" })
        }

        //if everything checks true, we get the contents of the request
        const body = req.body

        //we save the post to our database 
        const newPost = new postModel({ ...body, creatorId: userId })
        await newPost.save()
        res.status(201).json({ message: "Post created successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
};


const updatePost = async (req, res) => {
    try {
        //only a logged in client can update a post, we retrieve the id from the authorization middleware
        const userId = req.user.id

        //checking to see the user is logged by checking for the availability of a payload containg user id(userId) from the token
        if (!userId) {
            return res.status(401).json({ message: "User must be logged in to update a post" })
        }

        // if logged in we get the unique id of the post that is to be updated
        const { id } = req.params;

        //this line ensures that the id is a valid ObjectId for mongoose database
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }


        const { ...others } = req.body;

        //we check our database for a post with that id
        const postData = await postModel.findById(id)

        //if post is not found
        if (!postData) {
            return res.status(404).json({ message: "Post not found" })
        };

        //if post exist we compare the creatorId of the post with the id gotten from the token
        if (postData.creatorId.toString() !== userId) {
            return res.status(403).json({ message: "You can only update posts created by you" })
        }

        //if all checks out well
        await postModel.findByIdAndUpdate(id, { ...others }, { new: true });
        res.status(200).json({ message: "Post updated successfully" });


    } catch (error) {
        res.status(500).send("Something went wrong")
    };
};

const deletePost = async (req, res) => {
    try {
        //only logged in can perform this action
        const userId = req.user.id

        //getting the 
        const { id } = req.params

        //this line ensures that the id is a valid ObjectId for mongoose database
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }


        const postData = await postModel.findById(id)

        if (!postData) {
            return res.status(404).json({ message: "Post not found" })
        };

        if (postData.creatorId.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" })
        };

        await postModel.findByIdAndDelete(id)
        res.status(200).send("Post deleted successfully")

    } catch (error) {
        res.send("Something went wrong")

    }
};

const getAllPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find();

        if (allPosts.length === 0) {
            return res.status(404).json({ message: "No post found" })
        }

        res.status(200).json(allPosts)
    } catch (error) {
        res.status(500).json({ message: "Oopsie Something went wrong" })
    }

};


const getOnePost = async (req, res) => {
    try {
        const { id } = req.params

        //this line ensures that the id is a valid ObjectId for mongoose database
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }


        const onePost = await postModel.findById(id);

        //
        if (!onePost) {
            return res.status(404).json({ message: "Post not found" })
        };

        //returning post
        res.status(200).json(onePost);
    } catch (error) {
        console.log(error)

        res.status(500).send("Something went wrong ")
    }
};

export { createPost, updatePost, deletePost, getAllPosts, getOnePost }
import express from "express"
import { createPost, updatePost, deletePost, getAllPosts, getOnePost } from "../controllers/post.controllers.js"
import authorization from "../middlewares/authorization.js"

const routes = express.Router();

routes.post("/create", authorization, createPost);
routes.put("/update", authorization, updatePost);
routes.delete("/delete", authorization, deletePost);
routes.get("/allposts", getAllPosts);
routes.get("/:id", getOnePost)


export default routes
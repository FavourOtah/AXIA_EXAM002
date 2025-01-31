import express from "express"
import { registerUser, loginUser, updateUser, deleteUser, getAllUser, getOneUser } from "../controllers/user.controllers.js"
import authorization from "../middlewares/authorization.js";


const routes = express.Router();


routes.post("/registerUser", registerUser);
routes.post("/login", loginUser)
routes.get("/user/all", getAllUser);
routes.get("/user/:id", getOneUser);
routes.put("/user/update", authorization, updateUser);
routes.delete("/user/delete", authorization, deleteUser)


export default routes

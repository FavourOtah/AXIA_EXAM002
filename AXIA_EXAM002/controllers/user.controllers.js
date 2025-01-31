import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//creating a user
const registerUser = async (req, res) => {
    //get the payload from the user via destructuring
    const { password, name, email, ...others } = req.body

    try {
        //checks to see if all credentials needed for registration are provided
        if (!password || !name || !email) {
            return res.status(400).json({ message: "All fields are required" })
        }
        //checking to see details provided is already associated with another account
        const isUser = await userModel.findOne({ email })
        if (isUser) {
            return res.status(400).json({ message: "Email provided already belongs to an account" })
        }

        //checks to see the password is up to 15 characters
        if (password.length < 10) {
            return res.status(400).json({ message: "Pasword should be more than 15 characters" })
        }

        //now hashes the password using bcrypt
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        //saving the new user to the database

        const newUser = new userModel({ ...others, name, email, password: hashedPassword })
        await newUser.save()
        res.status(200).send("User created successfully")
    } catch (error) {
        res.send("Something went wrong")
    };
};


const loginUser = async (req, res) => {
    //getting payload 
    const { email, password } = req.body

    try {
        //ensuring all credentials are provided
        if (!email || !password) {
            return res.status(400).json({ message: "missing credential!" })
        }

        //checking to see if user exist
        const userData = await userModel.findOne({ email })
        if (!userData) {
            return res.status(404).json({ message: "Account not found" })
        };

        //cross check password provided
        const isPasswordValid = bcrypt.compareSync(password, userData.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is invalid" })
        };


        //creating a unique jwt token for this user
        const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, {})

        //creating and returning a cookie that contains the created token unique to this user
        return res.cookie("token", token, { httpOnly: true, secure: false }).status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    };
};


const updateUser = async (req, res) => {
    try {
        //get payload from frontend
        const { name, age } = req.body

        //getting my payload sent from the authorization file
        const verifiedUser = req.user.id

        //if the user is verified, now fetch the details of the user based on the id extracted from the token and update it with the newly provided payload
        await userModel.findByIdAndUpdate(verifiedUser, { name, age }, { new: true });
        res.status(200).json({ message: "Updated succesfully" })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
};

const deleteUser = async (req, res) => {
    //logic here is only a person that is logged in can delete an account, and 

    try {
        //getting my payload sent from the authorization middleware function
        const verifiedUser = req.user.id

        //find user based on the id extracted from the token and delete account
        await userModel.findByIdAndDelete(verifiedUser);
        res.status(204).json({ message: "Account succesfully deleted " })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    };
};

const getAllUser = async (req, res) => {
    try {
        const allUsers = await userModel.find();//this line fetches all user saved to the database 
        res.json(allUsers)//this line sends back all the users to the client.
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    };
};


const getOneUser = async (req, res) => {
    //get the id of the unique id of the user requested for
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Oops something went wrong" })
    };
};


export { registerUser, loginUser, updateUser, deleteUser, getAllUser, getOneUser }
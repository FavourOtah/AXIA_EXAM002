import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"


//loading environment variables first before initializing express app so that it is available for the app
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());


//establish connection with database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connection To Database Successful')
    })

    .catch(() => {
        console.log('Something went wrong')
    })


app.use(userRoutes)
app.use("/post", postRoutes)

app.listen(4040, () => { console.log('Our Server Is Running on PORT: 4040') })

//////SHOUT OUT TO MY MENTOR AND COACH, WHILE MY SERVER IS LISTENING, MY COACH IS INSPIRING
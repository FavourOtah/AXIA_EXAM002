import jwt from "jsonwebtoken"

const authorization = (req, res, next) => {
    //the logic here is that for a person to be able to update/delete an account or CRUD a post, he/she must be logged in, since you only get a token when you are logged in
    try {
        const { token } = req.cookies//get token from cookies
        if (!token) { return res.status(401).json({ message: "Log in to perform this action" }) }

        //next is to verify the token received
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token." })
            };
            req.user = payload//this line attaches the content of the payload to req.user, thus in other controllers I can make fetch the id from here.

            next();//according to my mentor this line passes the baton to the next function
        })
    } catch (error) {
        res.send("Something went wrong")
    }
};

export default authorization
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Jwt  from "jsonwebtoken";
export const registerUser = async (req, res) => {
    try {
        const {username,email,password}=req.body;
        console.log(username , email , password);
        if(!username||!email||!password){
                return res.status(400).json({
                    
        message:"Please fill all fields"
                })
            }
         const emailexists= await User.findOne({email})
        if(emailexists){
            return res.status(400).json({
                message:"user exists"
            })
        }
        const hashpassword=await bcrypt.hash(password,10)
        const user= await User.create({
            username, 
            email,
            password: hashpassword

        });
        if(!user){
            return res.status(400).json({
                message:"user not exists"
            })
        }    
        
       const token = Jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
        );
        res.status(200).json({
            message: "Data Received Successfully",
            token
        });
    }
    catch (error) {
        console.log(error.message)
    }
}
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({

                message: "Invalid Email or Password"

            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid Email or Password"

            });

        }

        const token = Jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({

            success: true,

            token

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
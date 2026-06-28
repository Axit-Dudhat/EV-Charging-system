import { registerUser, loginUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import express from "express";

const authRoutes = express.Router();

    authRoutes.post("/register", registerUser);
    authRoutes.post("/login",loginUser)
    authRoutes.get("/profile",protect,(req,res)=>{
        res.json({
        message:"Welcome",
        user:req.user
});

});

export default authRoutes;
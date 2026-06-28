import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import Connectdb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import router from "./routes/stationRoutes.js";
dotenv.config();
Connectdb();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/stations",router)

app.get("/",(req,res)=>{
    res.send("run")
});
const port=process.env.PORT||4000;
app.listen(port,()=>{
    console.log(`Running on Port :${port}`);
})
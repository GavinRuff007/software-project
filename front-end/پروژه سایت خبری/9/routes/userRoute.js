import express from "express";
import { Register, getAllUsers } from "../controllers/UserController.js";


const router = express.Router();

router.get("/api/users", getAllUsers)
router.post("/api/users/register", Register)




export default router;
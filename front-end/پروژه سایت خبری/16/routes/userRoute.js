import express from "express";
import { Login, Register, getAllUsers } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyTokne.js";
import { refreshToken } from "../controllers/RefreshToken.js";


const router = express.Router();
router.get("/token", refreshToken)

router.get("/api/users", verifyToken,getAllUsers)
router.post("/api/users/register", Register)
router.post("/api/users/login", Login)




export default router;
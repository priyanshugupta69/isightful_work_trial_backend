import express from "express";
import authController from "../../../Controller/authController";

const router = express.Router();

router.use('/auth', authController);

export default router;
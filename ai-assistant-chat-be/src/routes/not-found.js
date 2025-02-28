import express from "express";
import AppError from "../utils/app-error.js";

const router = express.Router();

router.all("*", async (req, _res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

export default router;

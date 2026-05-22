import express from "express";
import dependencies from "../dependencies/container.js";

const router = express.Router();

const { shareController } = dependencies.controllers;

router.get("/:publicId", (req, res, next) => shareController.getPublicAudit(req, res, next));

export default router;
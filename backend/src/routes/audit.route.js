import express from "express";
import dependencies from "../dependencies/container.js";

const router = express.Router();

const { auditController } = dependencies.controllers;

router.post("/create", (req, res, next) => auditController.createAudit(req, res, next));
router.get("/:id", (req, res, next) => auditController.getAudit(req, res, next));

export default router;
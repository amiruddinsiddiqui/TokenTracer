import express from "express";
import dependencies from "../dependencies/container.js";
import { validateAuditBody } from '../middlewares/validate.middleware.js';

const router = express.Router();

const { auditController, reportController } = dependencies.controllers;

router.post("/", validateAuditBody, (req, res, next) => auditController.createAudit(req, res, next));
router.get("/:id", (req, res, next) => reportController.getAudit(req, res, next));

export default router;
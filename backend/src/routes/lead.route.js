import express from "express";
import dependencies from "../dependencies/container.js";

const router = express.Router();

const { leadController } = dependencies.controllers;

router.post("/", (req, res, next) => leadController.createLead(req, res, next));

export default router;
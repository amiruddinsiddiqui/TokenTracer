import express from 'express';
import dependencies from '../dependencies/container.js';
import { honeypotMiddleware, validateLeadBody } from '../middlewares/validate.middleware.js';

const router = express.Router();

const { leadController } = dependencies.controllers;

router.post('/', honeypotMiddleware, validateLeadBody, (req, res, next) => leadController.createLead(req, res, next));

export default router;
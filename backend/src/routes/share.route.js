import express from 'express';
import dependencies from '../dependencies/container.js';

const router = express.Router();
const { shareController, reportController } = dependencies.controllers;

router.get('/:id/pdf', (req, res, next) =>
    reportController.exportSharePdf(req, res, next),
);

router.get('/:id', (req, res, next) =>
    shareController.getPublicAudit(req, res, next),
);

export default router;
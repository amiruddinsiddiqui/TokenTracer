import express from "express";
import cors from "cors";

import leadRoute from "./routes/lead.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoute);

export default app;
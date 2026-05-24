import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth";
import marketRouter from "./src/routes/market";
const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", marketRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

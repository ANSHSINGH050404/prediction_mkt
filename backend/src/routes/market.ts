import { prisma } from "../../db";
import { Router, type Request, type Response } from "express";
import { authenticate, type AuthPayload } from "./auth";

const router = Router();

router.get("/markets", authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user as AuthPayload;
    const markets = await prisma.market.findMany({
      where: { userId },
      include: { user: true },
    });
    res.json(markets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/markets", authenticate, async (req: Request, res: Response) => {
  try {
    const { userId, role } = (req as any).user as AuthPayload;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    const market = await prisma.market.create({
      data: {
        name,
        description,
        user: { connect: { id: userId } },
      },
    });

    return res.status(201).json(market);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/markets/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { userId, role } = (req as any).user as AuthPayload;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid market ID" });
    }

    const market = await prisma.market.findUnique({ where: { id } });
    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    await prisma.market.delete({ where: { id } });

    return res.json({ message: "Market deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});



export default router;

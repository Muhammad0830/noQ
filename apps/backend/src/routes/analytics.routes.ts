import { Router } from "express";

const analyticsRouter = Router();

analyticsRouter.get("/shops/:shopId/analytics", async (req, res) => {
  try {
    const { shopId } = req.params;
    
  } catch (error) {
    console.error("Error fetching shop analytics:", error);
    res.status(500).json({ error: "Failed to fetch shop analytics" });
  }
});

export default analyticsRouter;

import { Router } from "express";
const categoryRouter = Router();

categoryRouter.get("/", (req, res) => {
  res.send("Get all categories");
});

export default categoryRouter;

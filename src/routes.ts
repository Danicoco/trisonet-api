import { Router, Request, Response, NextFunction } from "express";
import v1 from "./modules/v1";
import settlementRouter from "./modules/v1/settlement/routes";

const router = Router();

// Controllers
router.use("/v1", v1);
router.use('/settlements', settlementRouter)


router.use("/", (_req: Request, res: Response, _next: NextFunction) =>
  res.send("Welcome to trisonet backend service API")
);

router.use("*", (_req: Request, res: Response, _next: NextFunction) =>
  res.send(`Unable to find the resources you're looking for.`)
);

export default router;

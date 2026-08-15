import { Router } from "express";
import { createPackage } from "../controllers/package.controller.js";

const router = Router();

router.route("/").get((req, res) => {
    res.send("Welcome to the Tours and Travels API");
});

router.route("/").post(createPackage);

const packageRouter = router;
export default packageRouter;
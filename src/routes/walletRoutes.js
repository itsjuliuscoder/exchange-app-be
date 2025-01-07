const express = require("express");
const router = express.Router();
const walletControllers = require("../controllers/walletControllers");

router.get("/balance/:address", walletControllers.getWalletBalance);
router.post("/send", walletControllers.sendTransaction);
router.post("/deposit", walletControllers.depositHandler);
router.post("/withdraw", walletControllers.withdrawHandler);
router.post(
  "/transactions/:walletAddress",
  walletControllers.transactionHandler
);

module.exports = router;

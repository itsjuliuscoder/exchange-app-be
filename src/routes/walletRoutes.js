const express = require("express");
const router = express.Router();

const {
  depositHandler,
  withdrawHandler,
  transactionHandler,
} = require("../controllers/walletControllers");

router.post("/deposit", depositHandler);
router.post("/withdraw", withdrawHandler);
router.post("/transactions/:walletAddress", transactionHandler);

module.exports = router;

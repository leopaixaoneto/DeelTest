const { BalanceController } = require("../Controllers/balanceController");
const { getProfile } = require("../middleware/getProfile");

const express = require("express");
const router = express.Router();

class BalanceRouter {
  static generate() {
    /**
     * Try to deposit some amount into user balance
     *
     * @returns the result of the deposit try
     */
    router.post("/deposit/:userId", getProfile, BalanceController.deposit);

    return router;
  }
}

module.exports = {
  BalanceRouter,
};

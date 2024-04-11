const { JobRouter } = require("./jobRouter.js");
const { AdminRouter } = require("./adminRouter.js");
const { BalanceRouter } = require("./balanceRouter.js");
const { ProfileRouter } = require("./profileRouter.js");
const { ContractRouter } = require("./contractRouter.js");

class RouterConfig {
  static config(app) {
    app.use("/api/jobs", JobRouter.generate());
    app.use("/api/admin", AdminRouter.generate());
    app.use("/api/profiles", ProfileRouter.generate());
    app.use("/api/balances", BalanceRouter.generate());
    app.use("/api/contracts", ContractRouter.generate());
  }
}

module.exports = {
  RouterConfig,
};

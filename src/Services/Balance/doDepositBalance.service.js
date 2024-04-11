const { GetAllUnpaidJobsUseCase } = require("../Job/getAllUnpaidJobs.service");

const { sequelize } = require("../../model.js");

class doDepositUseCase {
  static async handle({ profile, payload }, { app }) {
    const { Profile: pContext } = app.get("models");
    const { amount, userId } = payload;

    try {
      //First check to avoid some miss deposits
      if (profile.id != userId)
        throw new Error("You can't deposit to another client than yourself");

      //Consume service to get all unpaid jobs for this client
      const unpaiedJobs = await GetAllUnpaidJobsUseCase.handle({ profile }, { app });

      //logic to prevent some NaN errors with no unpaied jobs
      const unpaiedValue =
        unpaiedJobs.length > 0
          ? unpaiedJobs.reduce((prev, e) => {
              return prev + e.price;
            }, 0)
          : 0;

      if (unpaiedValue <= 0 || amount / unpaiedValue > 0.25)
        throw new Error("Deposit amount exceeds 25% of unpaid jobs");

      await sequelize.transaction(async (t) => {
        //will request again the profile so we can lock the payeer row
        const toDepositProfile = await pContext.findOne({
          where: {
            id: userId,
          },
          lock: true,
          transaction: t,
        });

        await toDepositProfile.increment("balance", { by: amount, transaction: t });
      });
    } catch (ex) {
      return { success: false, message: ex.message };
    }

    //If made this far means no errors occours
    return { success: true, message: "Deposit made successfully" };
  }
}

module.exports = {
  doDepositUseCase,
};

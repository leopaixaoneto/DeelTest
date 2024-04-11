const { Op } = require("sequelize");
const { Contract, sequelize } = require("../../model.js");

class PayJobUseCase {
  //base entry points: params, options
  static async handle({ profile, jobId }, { app }) {
    const { Job: jContext, Profile: pContext } = app.get("models");

    try {
      await sequelize.transaction(async (t) => {
        //Get the job which the user are trying to pay and lock
        const jobToPay = await jContext.findOne({
          where: {
            [Op.and]: [{ id: jobId }, { "$Contract.ClientId$": profile.id }, { paid: false }],
          },
          include: [
            {
              model: Contract,
              as: "Contract",
            },
          ],
          lock: true,
          transaction: t,
        });

        if (!jobToPay) throw new Error("Job not found, not owned by the requester or already paid");

        if (Number(jobToPay.price) > Number(profile.balance)) throw new Error("Insufficient funds");

        //After checking some logic we can request the receiver data and lock
        const receiverProfile = await pContext.findOne({
          where: {
            id: jobToPay.Contract.ContractorId,
          },
          lock: true,
          transaction: t,
        });

        if (!receiverProfile) throw new Error("Contractor doesnt exist!");

        //will request again the profile so we can lock the payeer row
        const payeerProfile = await pContext.findOne({
          where: {
            id: profile.id,
          },
          lock: true,
          transaction: t,
        });

        //Make the balance changes
        await receiverProfile.increment("balance", { by: Number(jobToPay.price), transaction: t });
        await payeerProfile.decrement("balance", { by: Number(jobToPay.price), transaction: t });

        //Update the job info
        await jContext.update(
          {
            paid: true,
            paymentDate: new Date(),
          },
          {
            where: { id: jobToPay.id },
            transaction: t,
          }
        );

        //finish
      });
    } catch (ex) {
      return { success: false, message: ex.message };
    }

    //If made this far means no errors occours
    return { success: true, message: "Job paid" };
  }
}

module.exports = {
  PayJobUseCase,
};

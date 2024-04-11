const { Op } = require("sequelize");
const { sequelize, Contract, Profile } = require("../../model");

class CalculateMostPaidProfessionUseCase {
  static async handle({ start, end }, { app }) {
    const { Job: jContext } = app.get("models");

    const result = {
      success: false,
      message: "",
      data: {},
    };

    try {
      const sum = await jContext.findOne({
        attributes: [
          [sequelize.col("Contract.Contractor.profession"), "profession"],
          [sequelize.fn("SUM", sequelize.col("price")), "totalReceived"],
        ],
        where: { [Op.and]: [{ paid: true }, { paymentDate: { [Op.between]: [start, end] } }] },
        include: [
          {
            model: Contract,
            as: "Contract",
            include: [
              {
                model: Profile,
                as: "Contractor",
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        group: ["profession"],
        order: [["totalReceived", "DESC"]],
        raw: true,
      });

      result.success = true;
      result.data = {
        profession: sum.profession,
        totalEarned: sum.totalReceived,
      };
    } catch (ex) {
      result.message = "Something went wrong fetching the data";
    }

    return result;
  }
}

module.exports = {
  CalculateMostPaidProfessionUseCase,
};

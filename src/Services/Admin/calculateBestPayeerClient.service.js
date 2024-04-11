const { Op } = require("sequelize");
const { sequelize, Contract, Profile } = require("../../model");

class CalculateBestPayeerClientUseCase {
  static async handle({ start, end, limit }, { app }) {
    const { Job: jContext } = app.get("models");

    const result = {
      success: false,
      message: "",
      data: {},
    };

    try {
      const sum = await jContext.findAll({
        attributes: [
          [sequelize.col("Contract.Client.id"), "ClientId"],
          [sequelize.fn("SUM", sequelize.col("price")), "totalPaid"],
        ],
        where: { [Op.and]: [{ paid: true }, { paymentDate: { [Op.between]: [start, end] } }] },
        include: [
          {
            model: Contract,
            as: "Contract",
            include: [
              {
                model: Profile,
                as: "Client",
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        group: ["ClientId"],
        order: [["totalPaid", "DESC"]],
        limit,
        raw: true,
      });

      result.success = true;
      result.data = sum;
    } catch (ex) {
      result.message = "Something went wrong fetching the data";
    }

    return result;
  }
}

module.exports = {
  CalculateBestPayeerClientUseCase,
};

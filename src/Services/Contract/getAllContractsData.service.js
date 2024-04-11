const { Op } = require("sequelize");

class GetAllContractDataUseCase {
  static async handle({ profile }, { app }) {
    const { Contract } = app.get("models");
    const { id, type } = profile;

    const clientTypeOption = type === "client" ? { ClientId: id } : { ContractorId: id };

    const contracts = await Contract.findAll({
      where: {
        [Op.and]: [clientTypeOption, { status: { [Op.ne]: "terminated" } }],
      },
    });

    return contracts;
  }
}

module.exports = {
  GetAllContractDataUseCase,
};

const { GetContractDataUseCase } = require("../Services/Contract/getContractData.service");
const { GetAllContractDataUseCase } = require("../Services/Contract/getAllContractsData.service");

class ContractController {
  static async getContract(req, res) {
    const { id } = req.params;
    const profile = req.profile;

    if (!id) return res.status(401).end();

    const result = await GetContractDataUseCase.handle(
      { profile, contractId: id },
      { app: req.app }
    );

    res.status(200).json({
      data: result,
    });
  }

  static async getAllContracts(req, res) {
    const profile = req.profile;

    const result = await GetAllContractDataUseCase.handle({ profile }, { app: req.app });

    if (result) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).end();
    }
  }
}

module.exports = {
  ContractController,
};

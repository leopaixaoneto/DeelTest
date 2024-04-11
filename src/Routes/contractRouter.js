const { ContractController } = require("../Controllers/contractController");
const { getProfile } = require("../middleware/getProfile");

const express = require("express");
const router = express.Router();

class ContractRouter {
  static generate() {
    /**
     * Fetch Contract data - Only if requester own the contract otherwise empty
     *
     * @param {number} id - The searched contract id
     *
     * @returns contract data by id
     */
    router.get("/:id", getProfile, ContractController.getContract);

    /**
     * Fetch all contracts owned by the requester id
     *
     * @returns Returns all contracts of logged user
     */
    router.get("/", getProfile, ContractController.getAllContracts);

    return router;
  }
}

module.exports = {
  ContractRouter,
};

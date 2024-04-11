const { JobController } = require("../Controllers/jobController");
const { getProfile } = require("../middleware/getProfile");

const express = require("express");
const router = express.Router();

class JobRouter {
  static generate() {
    /**
     * Fetch Unpaid Jobs data - Only for requester own contracts otherwise empty
     *
     * @returns Unpaid Jobs data by owner
     */
    router.get("/unpaid", getProfile, JobController.getAllUpaidJobs);

    /**
     * Try to pay a job
     *
     * @param {number} job_id  - The job_id which will try to get paid
     *
     * @returns return if the payment was done
     */
    router.post("/:jobId/pay", getProfile, JobController.payJob);

    return router;
  }
}

module.exports = {
  JobRouter,
};

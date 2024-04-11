const { mockSequelize, seed } = require("./mockModels.js");

const supertest = require("supertest");
const app = require("../app");

app.set("sequelize", mockSequelize);
app.set("models", mockSequelize.models);

beforeAll(async () => {
  await seed(mockSequelize.models);
});

describe("Contract Tests", () => {
  describe("Get contract data by contractId", () => {
    describe("given a valid contractId and a logged user", () => {
      it("Should return 200 and the contract data", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/contracts/2`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe("given a valid contractId and a logged user who doesnt own that contract", () => {
      it("Should return 200 and no contract data", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/contracts/3`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data.length).toBe(0);
      });
    });
  });

  describe("Get all contracts belonging to a user (only non terminated contracts)", () => {
    describe("given a valid logged user", () => {
      it("Should return 200 and the contract data", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/contracts/`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

describe("Balance Tests", () => {
  describe("Do a deposit", () => {
    describe("given base user", () => {
      it("Should have base balance amount", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/profiles/`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("balance");
        expect(body.balance).toBe(1150);
      });
    });

    describe("given a valid logged user and a valid amount to deposit", () => {
      it("Should return a 200 and a message with 'Deposit made successfully'", async () => {
        const { statusCode, body } = await supertest(app)
          .post(`/api/balances/deposit/1`)
          .send({
            amount: 50,
          })
          .set({
            profile_id: 1,
          });

        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Deposit made successfully");
        expect(statusCode).toBe(200);
      });
    });

    describe("given a valid logged user and a invalid amount to deposit", () => {
      it("Should return a 400 and a message with 'Deposit amount exceeds 25% of unpaid jobs'", async () => {
        const { statusCode, body } = await supertest(app)
          .post(`/api/balances/deposit/1`)
          .send({
            amount: 500,
          })
          .set({
            profile_id: 1,
          });

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Deposit amount exceeds 25% of unpaid jobs");
      });
    });

    describe("given base user after deposit", () => {
      it("Should have base balance amount changed (-201)", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/profiles/`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("balance");
        expect(body.balance).toBe(1200);
      });
    });
  });
});

describe("Job Tests", () => {
  describe("Get all unpaid Jobs", () => {
    describe("given the user has unpaid Jobs", () => {
      it("Should return a 200 and data array with unpaid job", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/jobs/unpaid`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe("given the user hasn't unpaid Jobs", () => {
      it("Should return a 200 and a empty data array", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/jobs/unpaid`).set({
          profile_id: 3,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data.length).toBe(0);
      });
    });
  });

  describe("Pay a Job", () => {
    describe("given base user", () => {
      it("Should have base balance amount", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/profiles/`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("balance");
        expect(body.balance).toBe(1200);
      });
    });

    describe("given the job able to be paid", () => {
      it("Should return a 200 and message string 'Job paid'", async () => {
        const { statusCode, body } = await supertest(app).post(`/api/jobs/2/pay`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Job paid");
      });
    });

    describe("given the job not able to be paid", () => {
      it("Should return a 400 and message string 'Job not found, not owned by the requester or already paid'", async () => {
        const { statusCode, body } = await supertest(app).post(`/api/jobs/2/pay`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Job not found, not owned by the requester or already paid");
      });
    });

    describe("given base user after payment", () => {
      it("Should have base balance amount changed (-201)", async () => {
        const { statusCode, body } = await supertest(app).get(`/api/profiles/`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("balance");
        expect(body.balance).toBe(999);
      });
    });
  });
});

describe("Admin Tests", () => {
  describe("Get the best paid professions", () => {
    describe("given the logged user as admin", () => {
      it("Should return the best paid profession of the database", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/api/admin/best-profession`)
          .query({ start: "2020-08-11 00:00:00.000+00", end: "2025-12-31 00:00:00.000+00" })
          .set({
            profile_id: 999,
          });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("profession");
        expect(body.data.profession).toBe("Programmer");
      });
    });
  });

  describe("Get the biggest payeer", () => {
    describe("given the logged user as admin", () => {
      it("Should return the 3 best payeer's of the database", async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/api/admin/best-clients`)
          .query({
            start: "2020-08-11 00:00:00.000+00",
            end: "2025-12-31 00:00:00.000+00",
            limit: 3,
          })
          .set({
            profile_id: 999,
          });

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body.data.length).toBe(3);
      });
    });
  });
});

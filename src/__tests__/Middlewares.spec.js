const { mockSequelize, seed } = require("./mockModels.js");

const supertest = require("supertest");
const app = require("../app");

app.set("sequelize", mockSequelize);
app.set("models", mockSequelize.models);

describe("Middleware Tests", () => {
  describe("Test getProfile middleware", () => {
    describe("Given a valid logged user", () => {
      it("Should return the logged user data", async () => {
        const { statusCode } = await supertest(app).get(`/api/profiles/`).set({
          profile_id: 1,
        });

        expect(statusCode).toBe(200);
      });
    });

    describe("Given a invalid logged user", () => {
      it("Should return status code 401 Forbidden", async () => {
        const { statusCode } = await supertest(app).get(`/api/profiles/`);

        expect(statusCode).toBe(401);
      });
    });
  });

  describe("Test isAdmin middleware", () => {
    describe("Given a valid admin logged user", () => {
      it("Should complete the request and return statuscode 200", async () => {
        const { statusCode } = await supertest(app)
          .get(`/api/admin/best-profession`)
          .query({ start: "2020-08-11 00:00:00.000+00", end: "2025-12-31 00:00:00.000+00" })
          .set({
            profile_id: 999,
          });
        expect(statusCode).toBe(200);
      });
    });

    describe("Given a invalid logged user", () => {
      it("Should return status code 401 Forbidden", async () => {
        const { statusCode } = await supertest(app)
          .get(`/api/admin/best-profession`)
          .query({ start: "2020-08-11 00:00:00.000+00", end: "2025-12-31 00:00:00.000+00" });

        expect(statusCode).toBe(401);
      });
    });
  });
});

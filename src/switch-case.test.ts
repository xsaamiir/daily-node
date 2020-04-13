/* eslint-disable @typescript-eslint/camelcase */
import { camelCase, snakeCase } from "./switch-case";

const testData = {
  first_name: "Thor",
  last_name: "Son of Odin",
  address: {
    home_planet: "Asgard",
  },
  friends: [
    {
      first_name: "Tony",
      last_name: "Stark",
      address: {
        home_planet: "Earth",
      },
    },
  ],
};

describe("camelCase", () => {
  it("should convert all object keys and nested keys from snake_case to camelCase", () => {
    expect(camelCase(testData)).toMatchObject({
      firstName: "Thor",
      lastName: "Son of Odin",
      address: {
        homePlanet: "Asgard",
      },
      friends: [
        {
          firstName: "Tony",
          lastName: "Stark",
          address: {
            homePlanet: "Earth",
          },
        },
      ],
    });
  });
});

describe("snakeCase", () => {
  it("should convert all object keys and nested keys from camelCase to snake_case", () => {
    expect(snakeCase(camelCase(testData))).toMatchObject(testData);
  });

  it("should do nothing on correct case", () => {
    expect(snakeCase(testData)).toMatchObject(testData);
  });
});

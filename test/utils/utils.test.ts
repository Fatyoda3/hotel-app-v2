import { describe, it, expect } from "@jest/globals";
import {
  parseSecret,
  hasInvalidCredentials,
  parsePort,
} from "../../src/utils/utils";

describe("parseSecret tests", () => {
  it("should return the provided secret when given a non-empty string", () => {
    expect(parseSecret("my-secret")).toBe("my-secret");
  });

  describe("fallback behavior", () => {
    it("should return fake-secret when given undefined", () => {
      expect(parseSecret(undefined)).toBe("fake-secret");
    });

    it("should return fake-secret when given an empty string", () => {
      expect(parseSecret("")).toBe("fake-secret");
    });
  });
});

describe("hasInvalidCredentials", () => {
  describe("invalid username", () => {
    it("should return true when given an empty username and a valid password", () => {
      expect(hasInvalidCredentials("", "password")).toBe(true);
    });

    it("should return true when given a whitespace username and a valid password", () => {
      expect(hasInvalidCredentials(" ", "password")).toBe(true);
    });
  });

  describe("invalid password", () => {
    it("should return true when given a valid username and an empty password", () => {
      expect(hasInvalidCredentials("username", "")).toBe(true);
    });

    it("should return true when given a valid username and a whitespace password", () => {
      expect(hasInvalidCredentials("username", " ")).toBe(true);
    });
  });

  describe("valid credentials", () => {
    it("should return false when given a valid username and password", () => {
      expect(hasInvalidCredentials("username", "password")).toBe(false);
    });
  });
});

describe("parsePort", () => {
  describe("fallback behavior", () => {
    it("should return fallback port when env variable is undefined", () => {
      expect(parsePort(undefined)).toBe(3000);
    });

    it("should return 3000 for an empty string", () => {
      expect(parsePort("")).toBe(3000);
    });

    it("should return 3000 for a whitespace-only string", () => {
      expect(parsePort(" ")).toBe(3000);
    });

    it("should return 3000 for a non-numeric string", () => {
      expect(parsePort("abc")).toBe(3000);
    });

    it("should return 3000 for an alphanumeric string", () => {
      expect(parsePort("3000abc")).toBe(3000);
    });

    it("should return 3000 for the string 'NaN'", () => {
      expect(parsePort("NaN")).toBe(3000);
    });
  });

  describe("valid numeric input", () => {
    it("should return the parsed number when env variable is passed", () => {
      expect(parsePort("8000")).toBe(8000);
    });

    it("should return the parsed number for a valid numeric string", () => {
      expect(parsePort("3001")).toBe(3001);
    });

    it("should return 0 for port string '0'", () => {
      expect(parsePort("0")).toBe(0);
    });

    it("should return a negative number when given a negative numeric string", () => {
      expect(parsePort("-1")).toBe(-1);
    });

    it("should return a floating point number when given a decimal string", () => {
      expect(parsePort("3000.5")).toBe(3000);
    });

    it("should return the parsed number for a string with leading and trailing whitespace", () => {
      expect(parsePort(" 3000 ")).toBe(3000);
    });
  });
});

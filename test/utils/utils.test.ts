import { describe, it, beforeEach, expect } from "@jest/globals";
import {
  getJwtSecret,
  hasInvalidCredentials,
  parsePort,
} from "../../src/utils/utils";
describe("Login Service", () => {
  it("should return the provided secret when given a non-empty string", () => {
    expect(getJwtSecret("my-secret")).toBe("my-secret");
  });

  it("should return fake-secret when given undefined", () => {
    expect(getJwtSecret(undefined)).toBe("fake-secret");
  });

  it("should return fake-secret when given an empty string", () => {
    expect(getJwtSecret("")).toBe("fake-secret");
  });

  it("should return true when given an empty username and a valid password", () => {
    expect(hasInvalidCredentials("", "password")).toBe(true);
  });

  it("should return true when given a whitespace username and a valid password", () => {
    expect(hasInvalidCredentials("   ", "password")).toBe(true);
  });

  it("should return true when given a valid username and an empty password", () => {
    expect(hasInvalidCredentials("username", "")).toBe(true);
  });

  it("should return true when given a valid username and a whitespace password", () => {
    expect(hasInvalidCredentials("username", "   ")).toBe(true);
  });

  it("should return false when given a valid username and password", () => {
    expect(hasInvalidCredentials("username", "password")).toBe(false);
  });

  it("should return fallback port as env variables are not set", () => {
    const port = parsePort(undefined);
    expect(port).toBe(3000);
  });

  it("should return fallback secret as env variables is passed", () => {
    const port = parsePort("8000");
    expect(port).toBe(8000);
  });

  it("should return fallback secret as env variables is empty", () => {
    const port = parsePort("");
    expect(port).toBe(3000);
  });
});

describe("parsePort", () => {
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

  it("should return 3000 for undefined", () => {
    expect(parsePort(undefined)).toBe(3000);
  });

  it("should return 3000 for an empty string", () => {
    expect(parsePort("")).toBe(3000);
  });

  it("should return 3000 for a non-numeric string", () => {
    expect(parsePort("abc")).toBe(3000);
  });

  it("should return 3000 for an alphanumeric string", () => {
    expect(parsePort("3000abc")).toBe(3000);
  });

  it("should return 3000 for a whitespace-only string", () => {
    expect(parsePort("   ")).toBe(3000);
  });

  it("should return NaN for the string 'NaN'", () => {
    expect(parsePort("NaN")).toBe(3000);
  });
});

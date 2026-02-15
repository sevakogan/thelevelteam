import { describe, it, expect } from "vitest";
import { validateLeadForm } from "@/lib/marketing/validation";

describe("validateLeadForm", () => {
  const validData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+14155551234",
    message: "I'm interested in your services",
    projectInterest: "crownvault",
    smsConsent: true,
    emailConsent: true,
  };

  it("accepts valid input", () => {
    const result = validateLeadForm(validData);
    expect(result.success).toBe(true);
  });

  it("accepts minimal valid input (no optional fields)", () => {
    const result = validateLeadForm({
      name: "Jo",
      email: "jo@test.com",
      phone: "+12025551234",
      smsConsent: false,
      emailConsent: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = validateLeadForm({ ...validData, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = validateLeadForm({ ...validData, name: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = validateLeadForm({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects phone without E.164 format", () => {
    const result = validateLeadForm({ ...validData, phone: "415-555-1234" });
    expect(result.success).toBe(false);
  });

  it("rejects phone without plus prefix", () => {
    const result = validateLeadForm({ ...validData, phone: "14155551234" });
    expect(result.success).toBe(false);
  });

  it("accepts international phone numbers", () => {
    const result = validateLeadForm({ ...validData, phone: "+447911123456" });
    expect(result.success).toBe(true);
  });

  it("rejects message longer than 1000 characters", () => {
    const result = validateLeadForm({ ...validData, message: "a".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = validateLeadForm({});
    expect(result.success).toBe(false);
  });

  it("rejects missing smsConsent", () => {
    const { smsConsent, ...rest } = validData;
    void smsConsent;
    const result = validateLeadForm(rest);
    expect(result.success).toBe(false);
  });
});

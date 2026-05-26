
import { describe, it, expect } from "vitest";
import { validateVacancy, formatSalary, getNextAvailableStatus } from "./vacancy-utils";

describe("vacancy-utils", () => {
  describe("validateVacancy", () => {
    // 1. Happy Path
    it("should return null for a valid plantilla vacancy", () => {
      const validVacancy = {
        title: "Administrative Assistant III",
        type: "plantilla" as const,
        itemNo: "OSEC-DECSB-12345",
      };
      expect(validateVacancy(validVacancy)).toBeNull();
    });

    it("should return null for a valid non-plantilla vacancy", () => {
      const validVacancy = {
        title: "Special Consultant",
        type: "non-plantilla" as const,
      };
      expect(validateVacancy(validVacancy)).toBeNull();
    });

    // 2. Edge Cases
    it("should return error for empty title", () => {
      expect(validateVacancy({ title: "" })).toBe("Title is required");
      expect(validateVacancy({ title: "   " })).toBe("Title is required");
    });

    it("should return error for very short title", () => {
      expect(validateVacancy({ title: "AB" })).toBe("Title must be at least 3 characters long");
    });

    it("should return error for plantilla without item number", () => {
      const invalidPlantilla = {
        title: "Teacher I",
        type: "plantilla" as const,
        itemNo: "N/A",
      };
      expect(validateVacancy(invalidPlantilla)).toBe("Item Number is required for plantilla positions");
    });

    // 3. Error Handling / Extreme Values
    it("should handle invalid deadline dates", () => {
      const invalidDate = {
        title: "Valid Title",
        deadline: "not-a-date",
      };
      expect(validateVacancy(invalidDate)).toBe("Invalid deadline date");
    });

    it("should handle null/undefined inputs gracefully", () => {
      // @ts-ignore - testing runtime robustness
      expect(validateVacancy({})).toBe("Title is required");
    });
  });

  describe("formatSalary", () => {
    it("should format numeric string correctly", () => {
      expect(formatSalary("24329")).toContain("24,329.00");
    });

    it("should handle strings with existing symbols", () => {
      expect(formatSalary("₱ 25,000.50")).toContain("25,000.50");
    });

    it("should handle numbers directly", () => {
      expect(formatSalary(15000)).toContain("15,000.00");
    });

    it("should return N/A for empty inputs", () => {
      expect(formatSalary("")).toBe("N/A");
      expect(formatSalary(undefined)).toBe("N/A");
      // @ts-ignore
      expect(formatSalary(null)).toBe("N/A");
    });

    it("should return Invalid Amount for non-numeric junk", () => {
      expect(formatSalary("asdf")).toBe("Invalid Amount");
    });
  });

  describe("getNextAvailableStatus", () => {
    it("should allow HRMO to submit Drafts", () => {
      expect(getNextAvailableStatus("Draft", "hrmo")).toEqual(["Pending CSC"]);
    });

    it("should allow CSC to publish or return Pending CSC", () => {
      expect(getNextAvailableStatus("Pending CSC", "csc")).toEqual(["Published", "Returned"]);
    });

    it("should return empty array for unauthorized roles", () => {
      expect(getNextAvailableStatus("Draft", "applicant")).toEqual([]);
    });

    it("should return empty array for terminal statuses", () => {
      expect(getNextAvailableStatus("Published", "csc")).toEqual([]);
      expect(getNextAvailableStatus("Published", "hrmo")).toEqual([]);
    });

    it("should handle unknown status gracefully", () => {
      expect(getNextAvailableStatus("Unknown", "hrmo")).toEqual([]);
    });
  });
});

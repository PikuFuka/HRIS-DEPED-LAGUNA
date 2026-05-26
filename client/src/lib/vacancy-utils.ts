
export interface Vacancy {
  id: number;
  title: string;
  status: string;
  deadline: string;
  itemNo: string;
  type: "plantilla" | "non-plantilla";
  employmentStatus?: string;
  salaryGrade?: string;
  monthlySalary?: string;
}

/**
 * Validates a vacancy object.
 * Returns an error message if invalid, or null if valid.
 */
export function validateVacancy(vacancy: Partial<Vacancy>): string | null {
  if (!vacancy.title || vacancy.title.trim() === "") {
    return "Title is required";
  }
  
  if (vacancy.title.length < 3) {
    return "Title must be at least 3 characters long";
  }

  if (vacancy.type === "plantilla" && (!vacancy.itemNo || vacancy.itemNo === "N/A")) {
    return "Item Number is required for plantilla positions";
  }

  if (vacancy.deadline) {
    const deadlineDate = new Date(vacancy.deadline);
    if (isNaN(deadlineDate.getTime())) {
      return "Invalid deadline date";
    }
  }

  return null;
}

/**
 * Formats currency to PHP
 */
export function formatSalary(amount: string | number | undefined): string {
  if (amount === undefined || amount === null || amount === "") {
    return "N/A";
  }
  
  const numericAmount = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.]/g, "")) : amount;
  
  if (isNaN(numericAmount)) {
    return "Invalid Amount";
  }
  
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(numericAmount);
}

/**
 * Determines available status transitions based on user role and current status
 */
export function getNextAvailableStatus(status: string, role: string): string[] {
  if (role === "hrmo") {
    if (status === "Draft") return ["Pending CSC"];
  }
  
  if (role === "csc") {
    if (status === "Pending CSC") return ["Published", "Returned"];
  }
  
  return [];
}

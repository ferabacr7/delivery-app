import { QuoteInput, QuoteValidationResult } from "./models";

export class Validator {
  validate(input: QuoteInput): QuoteValidationResult {
    const errors: string[] = [];

    if (!input.orderId) {
      errors.push("Order ID is required.");
    }

    if (!input.description || input.description.trim().length === 0) {
      errors.push("Order description is required.");
    }

    if (!input.serviceType) {
      errors.push("Service type is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
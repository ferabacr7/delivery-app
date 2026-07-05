import { LocationResolver } from "./locationResolver";
import { GeneratedQuote, QuoteInput } from "./models";
import { QuoteCalculator } from "./quoteCalculator";
import { QuoteGenerator } from "./quoteGenerator";
import { Validator } from "./validator";

export class QuoteOrchestrator {
  constructor(
    private readonly validator = new Validator(),
    private readonly locationResolver = new LocationResolver(),
    private readonly quoteCalculator = new QuoteCalculator(),
    private readonly quoteGenerator = new QuoteGenerator()
  ) {}

  generateQuote(input: QuoteInput): GeneratedQuote {
    const validation = this.validator.validate(input);

    if (!validation.isValid) {
      throw new Error(validation.errors.join(" "));
    }

    const location = this.locationResolver.resolve(input.locationText);

    const calculation = this.quoteCalculator.calculate(
      input.serviceType,
      location
    );

    return this.quoteGenerator.generate(input, calculation, location);
  }
}
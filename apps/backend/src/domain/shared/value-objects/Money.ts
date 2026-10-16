
export type Currency = "UZS" | "USD";

export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: Currency,
  ) {
    if (!Number.isSafeInteger(amount)) {
      throw new Error("Money amount must be a safe integer");
    }
  }

  static zero(currency: Currency): Money {
    return new Money(0, currency);
  }

  static fromAmount(
    amount: number,
    currency: Currency,
  ): Money {
    return new Money(amount, currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(
      this.amount + other.amount,
      this.currency,
    );
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(
      this.amount - other.amount,
      this.currency,
    );
  }

  multiply(quantity: number): Money {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      throw new Error("Quantity must be a non-negative integer");
    }

    return new Money(
      this.amount * quantity,
      this.currency,
    );
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount < other.amount;
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.amount &&
      this.currency === other.currency
    );
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  format(locale = "uz-UZ"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this.currency,
      maximumFractionDigits: 0,
    }).format(this.amount);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Currency mismatch: ${this.currency} and ${other.currency}`,
      );
    }
  }
}

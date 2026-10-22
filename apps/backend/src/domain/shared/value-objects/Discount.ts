import { Money } from "./Money.js";

export class Discount {
    private constructor(
        public readonly money: Money,
    ) { }

    static fixed(amount: Money): Discount {
        if (amount.amount < 0) {
            throw new Error("Discount cannot be negative");
        }

        return new Discount(amount);
    }

    applyTo(price: Money): Money {
        if (price.currency !== this.money.currency) {
            throw new Error("Discount curreny mismatch");
        }

        if (this.money.isGreaterThan(price)) {
            throw new Error("Discount exceeds the price");
        }

        return price.subtract(this.money);
    }

    static percentage(
        price: Money,
        percentage: number,
    ): Discount {
        if (
            !Number.isFinite(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            throw new Error("Percentage must be between 0 and 100")
        }

        const amount = Math.round(price.amount * percentage / 100);

        return Discount.fixed(
            Money.fromAmount(amount, price.currency),
        );
    }
}
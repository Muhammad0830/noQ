
export class EmailAddress {
    private constructor(
        public readonly value: string,
    ) { }

    static from(email: string): EmailAddress {
        const normalizedEmail = email.trim().toLowerCase();

        if (!EmailAddress.isValidSring(normalizedEmail)) {
            throw new Error("Invalid email address");
        }

        return new EmailAddress(normalizedEmail);
    }

    static isValidSring(email: string): boolean {
        if (
            email.length === 0 ||
            email.length > 254 ||
            !email.includes("@")
        ) {
            return false;
        }

        const parts = email.split("@");

        if (parts.length !== 2) {
            return false;
        }

        const [localPart, domain] = parts as [string, string];

        if (
            localPart.length === 0 ||
            localPart.length > 64 ||
            domain.length === 0
        ) {
            return false;
        }

        if (
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(
                localPart,
            )
        ) {
            return false;
        }

        if (
            localPart.startsWith(".") ||
            localPart.endsWith(".") ||
            localPart.includes("..")
        ) {
            return false;
        }

        const domainLabels = domain.split(".");

        if (domainLabels.length < 2) {
            return false;
        }

        return domainLabels.every(
            (label) =>
                label.length > 0 &&
                label.length <= 63 &&
                /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
                    label,
                ),
        );
    }

    isValid(): boolean {
        return EmailAddress.isValidSring(this.value);
    }

    equals(other: EmailAddress): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}

export type ShopScheduleTypeValue =
    | "OPEN"
    | "BLOCK"

export class ShopScheduleType {
    constructor(
        private readonly value: ShopScheduleTypeValue,
    ) { }

    static readonly OPEN = new ShopScheduleType('OPEN')
    static readonly BLOCK = new ShopScheduleType('BLOCK')

    static from(value: ShopScheduleTypeValue): ShopScheduleType {
        return new ShopScheduleType(value);
    }

    getValue(): ShopScheduleTypeValue {
        return this.value;
    }

    equals(other: ShopScheduleType): boolean {
        return this.value === other.getValue();
    }

    isOpen(): boolean {
        return this.value === 'OPEN';
    }
}
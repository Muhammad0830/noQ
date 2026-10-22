import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

interface Props {
    start: DateTime,
    end: DateTime,
}

export class TimeSlot {
    private constructor(
        private readonly props: Props
    ) { }

    static create(props: Props): TimeSlot {
        if (!props.start.lessThan(props.end)) {
            throw new Error("Start time must be before end time");
        }

        return new TimeSlot(props)
    }

    getStartTime(): DateTime {
        return this.props.start;
    }

    getEndTime(): DateTime {
        return this.props.end;
    }

    durationMinutes(): number {
        return this.props.end.getDifference(this.props.start) / 60_000;
    }

    overlaps(other: TimeSlot): boolean {
        return this.props.start.lessThan(other.props.end) &&
            this.props.end.greaterThan(other.props.start);
    }

    contains(time: DateTime): boolean {
        return !time.lessThan(this.props.start) && time.lessThan(this.props.end);
    }
}
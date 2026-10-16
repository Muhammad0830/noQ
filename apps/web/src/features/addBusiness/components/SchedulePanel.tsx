import { useTranslations } from "next-intl";
import { Dispatch, FC, Fragment, SetStateAction } from "react";
import { getToday } from "../utils";
import { DaySchedule, ExpandedDay } from "../types";
import { Check, Clock3, Coffee, Pencil, Plus, Trash2 } from "lucide-react";

interface SchedulePanelProps {
    days: DaySchedule[],
    expandedDay: ExpandedDay,
    toggleDay: (day: ExpandedDay) => void;
    setExpandedDay: Dispatch<SetStateAction<ExpandedDay>>;
    removeBreak: (id: string, breakIndex: number) => void;
    openTimePickerDrawerModal: (
        id: string,
        field: "startTime" | "endTime",
        mode?: "add" | "edit",
        breakIndex?: number
    ) => void;
}

const SchedulePanel: FC<SchedulePanelProps> = ({
    days,
    expandedDay,
    toggleDay,
    setExpandedDay,
    removeBreak,
    openTimePickerDrawerModal,
}) => {
    const t = useTranslations()

    return (
        <section>
            <h3 className="pb-2 text-[21px] font-bold tracking-tight text-[#1f1f1f]">
                {t("admin.schedule.weekly")}
            </h3>

            <div className="space-y-2.5">
                {days.map((item) => {
                    const isExpanded = expandedDay === item.id;
                    const dayLabel = t(`admin.schedule.day.${item.day.toLowerCase()}`);
                    const hoursText = item.enabled
                        ? `${item.openStart} - ${item.openEnd}`
                        : t("admin.schedule.closed");

                    return (
                        <article
                            key={item.id}
                            className={`rounded-[14px] border bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(17,24,39,0.04)] ${isExpanded ? "border-[#f0bc89]" : "border-[#e7e8ec]"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[18px] font-semibold tracking-tight text-[#252a31]">
                                            {dayLabel}
                                        </p>
                                        {item.id === getToday() && (
                                            <span className="rounded-full bg-[#f9b15a] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                                                {t("admin.schedule.today")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-[#8d94a1]">
                                        <span>{hoursText}</span>
                                        {item.enabled && (
                                            <>
                                                <span className="mx-1 text-[#d6d9de]">•</span>
                                                <span className="text-[#f39a36]">
                                                    {t("admin.schedule.breakCount", {
                                                        count: item.breaks.length,
                                                    })}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(item.day)}
                                        className={`relative h-6 w-11 rounded-full transition-colors ${item.enabled ? "bg-[#24b565]" : "bg-[#dbdde2]"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${item.enabled ? "left-5.5" : "left-0.5"
                                                }`}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!item.enabled}
                                        onClick={() =>
                                            setExpandedDay((prev) =>
                                                prev === item.id
                                                    ? ""
                                                    : (item.id as ExpandedDay),
                                            )
                                        }
                                        className={`inline-flex items-center justify-center transition-colors ${isExpanded
                                            ? "h-9 w-9 rounded-2xl bg-[#f2f3f5] text-[#20b35f]"
                                            : "h-9 w-9 rounded-full text-[#b8bdc8] hover:bg-[#f3f4f6]"
                                            } ${!item.enabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}`}
                                    >
                                        {isExpanded ? (
                                            <Check className="h-4 w-4 text-[#21b462]" />
                                        ) : (
                                            <Pencil className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {isExpanded && item.enabled && (
                                <div className="mt-3 border-t border-[#eceef2] pt-3">
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-[40px_auto_1fr_auto_1fr] items-center gap-1.5">
                                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4eee9] text-[#e8a767]">
                                                <Clock3 className="h-3.5 w-3.5" />
                                            </div>
                                            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#959daa]">
                                                {t("admin.schedule.hours")}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openTimePickerDrawerModal(
                                                        item.id,
                                                        "startTime",
                                                        "edit"
                                                    )
                                                }
                                                className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d9dde3] bg-[#f3f4f6] px-2.5 text-[13px] font-bold text-[#1e232b]"
                                            >
                                                {item.openStart}
                                            </button>
                                            <span className="text-[15px] text-[#c5cbd4]">
                                                -
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openTimePickerDrawerModal(
                                                        item.id,
                                                        "endTime",
                                                        "edit"
                                                    )
                                                }
                                                className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d9dde3] bg-[#f3f4f6] px-2.5 text-[13px] font-bold text-[#1e232b]"
                                            >
                                                {item.openEnd}
                                            </button>
                                        </div>

                                        {(item.breaks.length > 0
                                            ? item.breaks
                                            : [{ startTime: "", endTime: "" }]
                                        ).map((breakItem, breakIndex) => {
                                            const hasBreaks = item.breaks.length > 0;

                                            return (
                                                <div
                                                    key={`${item.id}-break-${breakIndex}`}
                                                    className="grid grid-cols-[40px_auto_1fr_auto_1fr_auto] items-center gap-1.5"
                                                >
                                                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4eee9] text-[#e8a767]">
                                                        <Coffee className="h-3.5 w-3.5" />
                                                    </div>

                                                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#959daa]">
                                                        {t("admin.schedule.break")}
                                                    </p>

                                                    {(["startTime", "endTime"] as const).map((field, index) => (
                                                        <Fragment key={field}>
                                                            {index === 1 && (
                                                                <span className="text-[15px] text-[#c5cbd4]">-</span>
                                                            )}

                                                            <button
                                                                type="button"
                                                                disabled={!hasBreaks && field === "endTime"}
                                                                onClick={() =>
                                                                    openTimePickerDrawerModal(
                                                                        item.id,
                                                                        field,
                                                                        hasBreaks ? "edit" : "add",
                                                                        hasBreaks ? breakIndex : undefined,
                                                                    )
                                                                }
                                                                className={`inline-flex h-9 items-center justify-center rounded-xl border border-[#f1dcc5] bg-[#fcf7f1] px-2.5 text-[13px] font-bold text-[#262b33] ${!hasBreaks && field === "endTime" ? "opacity-50" : ""
                                                                    }`}
                                                            >
                                                                {breakItem[field] || "-:-"}
                                                            </button>
                                                        </Fragment>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        disabled={!hasBreaks}
                                                        onClick={() => removeBreak(item.id, breakIndex)}
                                                        className={`inline-flex h-6 w-6 items-center justify-center text-[#ff6662] ${!hasBreaks ? "opacity-40" : ""
                                                            }`}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openTimePickerDrawerModal(item.id, "startTime")}
                                        className="mt-1 inline-flex items-center gap-2 text-[12px] font-semibold text-[#ef942b]"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {t("admin.schedule.addBreak")}
                                    </button>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default SchedulePanel;
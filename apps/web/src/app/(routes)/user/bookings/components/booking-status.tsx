import { AlertCircle, Check, Clock3, X } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ongoing":
      return "border border-[#F49B33]/50 bg-[#F49B33] text-white dark:border-[#F49B33]/55 dark:bg-[#F49B33] dark:text-white";
    case "completed":
      return "border border-green-400/35 bg-green-500/15 text-green-700 dark:border-green-400/25 dark:text-green-300";
    case "cancelled":
      return "border border-red-400/35 bg-red-500/15 text-red-700 dark:border-red-400/25 dark:text-red-300";
    default:
      return "border border-slate-300 bg-slate-200/80 text-slate-700 dark:border-slate-400/20 dark:bg-slate-600/30 dark:text-slate-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "ongoing":
      return <Clock3 className="h-3.5 w-3.5" />;
    case "completed":
      return <Check className="h-3.5 w-3.5" />;
    case "cancelled":
      return <X className="h-3.5 w-3.5" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5" />;
  }
};

export const getStatusLabel = (status: string, t: (key: string) => string) => {
  switch (status) {
    case "ongoing":
      return t("history.status.ongoing");
    case "completed":
      return t("history.status.completed");
    case "cancelled":
      return t("history.status.cancelled");
    case "PENDING":
      return t("history.status.pending");
    case "CONFIRMED":
      return t("history.status.confirmed");
    case "IN_PROGRESS":
      return t("history.status.inProgress");
    default:
      return status;
  }
};

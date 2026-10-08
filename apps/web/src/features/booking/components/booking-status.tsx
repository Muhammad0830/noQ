import { AlertCircle, Check, Clock3, X } from "lucide-react";
import { BookingStatus } from "../types";

export const STATUS_ICONS: Record<BookingStatus, React.ReactNode> = {
  [BookingStatus.PENDING]: <Clock3 className="h-3.5 w-3.5" />,
  [BookingStatus.CONFIRMED]: <Check className="h-3.5 w-3.5" />,
  [BookingStatus.IN_PROGRESS]: <Clock3 className="h-3.5 w-3.5" />,
  [BookingStatus.COMPLETED]: <Check className="h-3.5 w-3.5" />,
  [BookingStatus.CANCELLED]: <X className="h-3.5 w-3.5" />,
  [BookingStatus.NO_SHOW]: <AlertCircle className="h-3.5 w-3.5" />,
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "user.history.status.pending",
  [BookingStatus.CONFIRMED]: "user.history.status.confirmed",
  [BookingStatus.IN_PROGRESS]: "user.history.status.in_progress",
  [BookingStatus.COMPLETED]: "user.history.status.completed",
  [BookingStatus.CANCELLED]: "user.history.status.cancelled",
  [BookingStatus.NO_SHOW]: "user.history.status.noShow",
};

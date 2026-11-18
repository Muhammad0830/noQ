import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { UserIdentity, UserIdentityListResponse } from "@noq/shared";
import { cn } from "cn";
import { Search, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useState } from "react";
import UserSearchList from "./UserSearchList";

interface SearchUserDialogProps {
    selectedCustomer: UserIdentity | null;
    shopId: string | undefined
    setSelectedCustomer: Dispatch<SetStateAction<UserIdentity | null>>
}

const SearchUserDialog: FC<SearchUserDialogProps> = ({
    selectedCustomer,
    shopId,
    setSelectedCustomer,
}) => {
    const t = useTranslations();

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>("");

    const { data: users = { data: [] }, isLoading } = useApiQuery<UserIdentityListResponse>(
        `${API_ENDPOINTS.admin.users}?search=${search}`,
        {
            key: ["admin-new-booking-users", shopId || "guest", search],
            enabled: !!(shopId && search),
            staleTime: 30_000,
            headers: { "x-shop-id": shopId ?? '' },
        },
    );

    const handleSelectUser = (customer: UserIdentity) => {
        setOpen(false);
        setSelectedCustomer(customer);
    }

    return (
        <section className="mb-3">
            <h3 className="mb-2 text-sm font-bold text-slate-900">
                2. {t("user.booking.customer")}
            </h3>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "mb-3 flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-orange-300 hover:bg-orange-50",
                            selectedCustomer && "bg-primary/5 border-primary/30"
                        )}
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shrink-0">
                            <UserRound className="h-4 w-4 text-gray-500" />
                        </span>

                        <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-gray-800">
                                {selectedCustomer ? selectedCustomer.name : t("admin.newBooking.selectCustomer")}
                            </span>

                            <span className="block truncate text-xs text-gray-500">
                                {selectedCustomer?.email || t("admin.newBooking.selectByPressing")}
                            </span>
                        </div>
                    </button>
                </DialogTrigger>

                <DialogContent className="max-h-[80vh] overflow-y-auto flex flex-col">
                    <DialogTitle>{t("admin.newBooking.searchCustomer")}</DialogTitle>

                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("admin.newBooking.searchCustomer")}
                            className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm"
                        />
                    </div>

                    <div className={cn(
                        "flex-1 overflow-y-auto space-y-2 pr-1",
                        !search && "hidden"
                    )}>
                        <UserSearchList
                            selectedCustomer={selectedCustomer}
                            users={users.data}
                            isLoading={isLoading}
                            onSelectUser={handleSelectUser}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}

export default SearchUserDialog;
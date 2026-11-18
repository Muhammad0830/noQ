import { UserIdentity } from "@noq/shared";
import { cn } from "cn";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface UserSearchListProps {
    selectedCustomer: UserIdentity | null,
    users: UserIdentity[],
    isLoading: boolean,
    onSelectUser: (customer: UserIdentity) => void;
}

const UserSearchList: FC<UserSearchListProps> = ({
    selectedCustomer,
    users,
    isLoading,
    onSelectUser,
}) => {
    const t = useTranslations();

    if (isLoading) {
        return (
            <p className="text-sm text-gray-500">
                {t("common.loading")}
            </p>
        )
    }

    if (users.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                {t("admin.newBooking.noCustomers")}
            </p>
        )
    }

    return (
        users.map((customer) => {
            const active = selectedCustomer?.id === customer.id;
            return (
                <button
                    key={customer.id}
                    type="button"
                    onClick={() => onSelectUser(customer)}
                    className={cn(
                        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left",
                        active ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"
                    )}
                >
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <UserRound className="h-4 w-4 text-gray-500" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-gray-800">
                            {customer.name}
                        </span>

                        <span className="block truncate text-xs text-gray-500">
                            {customer.email}
                        </span>
                    </div>
                </button>
            );
        })
    )
}

export default UserSearchList;
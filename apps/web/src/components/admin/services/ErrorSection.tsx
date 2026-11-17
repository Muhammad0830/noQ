import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ErrorSectionProps {
    serviceDataError?: AxiosError | null,
    serviceUpdateError?: Error | null,
}

const ErrorSection: FC<ErrorSectionProps> = ({
    serviceDataError,
    serviceUpdateError,
}) => {
    const t = useTranslations();

    if (serviceDataError) {
        return (
            <div className="mt-4 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {(serviceDataError.message || t("admin.services.error.loadFailed"))}
            </div>
        )
    }

    if (serviceUpdateError) {
        return (
            <div className="mt-4 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serviceUpdateError.message}
            </div>
        )
    }

    return null;
}

export default ErrorSection;
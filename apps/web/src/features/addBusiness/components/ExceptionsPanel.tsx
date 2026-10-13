import { useTranslations } from "next-intl";

const ExceptionsPanel = () => {
    const t = useTranslations()
    return (
        <section className="rounded-3xl border border-dashed border-[#d2d6de] bg-white px-4 py-8 text-center">
            <h3 className="text-[16px] font-semibold text-[#2e3440]">
                {t("admin.schedule.exceptions.title")}
            </h3>
            <p className="mt-1 text-[13px] text-[#8f96a3]">
                {t("admin.schedule.exceptions.description")}
            </p>
        </section>
    );
}

export default ExceptionsPanel;
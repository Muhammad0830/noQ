"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import barbershopBanner from "../../assets/Barbershop.png";
import dentalClinicBanner from "../../assets/Dental clinic.png";

interface HeroSectionProps {
  onSearch?: (query: string, location: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeBanner, setActiveBanner] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const banners = [
    {
      id: "barbershop",
      image: barbershopBanner,
      alt: t("hero.banner.barbershop.alt"),
      badge: t("hero.banner.barbershop.badge"),
      title: t("hero.banner.barbershop.title"),
      subtitle: t("hero.banner.barbershop.subtitle"),
    },
    {
      id: "dental-clinic",
      image: dentalClinicBanner,
      alt: t("hero.banner.dental.alt"),
      badge: t("hero.banner.dental.badge"),
      title: t("hero.banner.dental.title"),
      subtitle: t("hero.banner.dental.subtitle"),
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  const goToBanner = (index: number) => {
    setActiveBanner(index);
  };

  const nextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        nextBanner();
      } else {
        prevBanner();
      }
    }

    touchStartX.current = null;
  };

  const openDiscover = () => {
    router.push("/user/discover?focus=search");
  };

  return (
    <section className="bg-white dark:bg-[#211201]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
        <form className="w-full">
          <div className="flex items-center gap-2 rounded-2xl border border-[#f1c894] bg-white px-3 py-2.5 shadow-sm dark:border-[#4a2e1b] dark:bg-white">
            <Search className="h-5 w-5 text-[#F49B33] dark:text-[#F49B33]" />
            <input
              type="text"
              placeholder={t("hero.search.placeholder")}
              readOnly
              onClick={openDiscover}
              onFocus={openDiscover}
              className="h-6 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-[#d0954d]"
            />
            <button
              type="button"
              onClick={openDiscover}
              className="rounded-lg bg-[#fff3e6] p-2 text-[#F49B33] transition hover:bg-[#fce2c4]"
              aria-label={t("filter.title")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div
          className="mt-3 overflow-hidden rounded-2xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeBanner * 100}%)` }}
          >
            {banners.map((banner) => (
              <button
                key={banner.id}
                type="button"
                onClick={openDiscover}
                className="relative min-w-full h-45 sm:h-48 md:h-52 focus:outline-hidden"
                aria-label={banner.alt}
              >
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1152px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent" />
                <div className="absolute left-3 sm:left-4 top-3 sm:top-4 z-10">
                  <span className="inline-flex items-center rounded-md bg-[#F49B33] px-2 py-1 text-[9px] sm:text-[10px] font-semibold tracking-wide text-white">
                    {banner.badge}
                  </span>
                </div>
                <div className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 right-3 sm:right-4 text-left text-white">
                  <p className="mt-1.5 text-xl sm:text-3xl font-bold leading-tight max-w-[85%]">
                    {banner.title}
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-200">
                    {banner.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goToBanner(index)}
              className={`h-1.5 rounded-full transition-all ${
                activeBanner === index
                  ? "w-5 bg-[#F49B33] dark:bg-[#F49B33]"
                  : "w-1.5 bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={t("hero.goToBanner", { index: index + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

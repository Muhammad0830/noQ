import { cn } from 'cn';
import { ChevronRight } from 'lucide-react';
import { Route } from 'next';
import Link from 'next/link';
import React from 'react'

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  href: Route;
  border_top?: boolean;
}

export default function ProfileRowLink({
  icon,
  title,
  subtitle,
  href,
  border_top = false,
}: Props) {
  return (
    <Link
      href={href}
      type="button"
      className={
        cn("flex w-full items-center gap-3 min-h-16 px-6 text-left transition hover:bg-[#fff3e6]",
          border_top && "border-t border-[#f1c894]",
        )}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-900">
          {title}
        </span>
        <span className="block truncate text-xs text-slate-500">
          {subtitle}
        </span>
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-[#F49B33]" />
    </Link>
  );
}
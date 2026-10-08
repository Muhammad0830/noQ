import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React from 'react'

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  bordered?: boolean;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

export default function ProfileRowButton({
  icon,
  title,
  subtitle,
  bordered = false,
  trailing,
  onClick,
}: Props) {
  return (
    <Button
      onClick={onClick}
      type="button"
      className={cn(
        "flex w-full items-center gap-3 min-h-16 text-left transition bg-transparent hover:bg-[#fff3e6]",
        bordered && "border-t border-[#f1c894]"
      )}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-900">
          {title}
        </span>
        <span className="block truncate font-medium text-xs text-slate-500">
          {subtitle}
        </span>
      </span>

      {trailing || <ChevronRight className="h-4 w-4 shrink-0 text-[#F49B33]" />}
    </Button>
  );
}
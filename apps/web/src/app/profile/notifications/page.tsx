"use client";

import { useRouter } from "next/navigation";

export default function SecurityPasswordPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#060912] px-4 py-6 text-white">
      <div className="mx-auto w-full max-w-[650px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/90"
        >
          Back
        </button>

        <h1 className="text-xl font-semibold">Notification page</h1>
        <p className="mt-2 text-sm text-white/70">
          Notification page sahifasi uchun joy tayyorlandi.
        </p>
      </div>
    </main>
  );
}

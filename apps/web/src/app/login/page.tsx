"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useProviderMode } from "@/contexts/ProviderModeContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const { setProviderMode } = useProviderMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password, formData.remember);
      if (selectedRole === "admin") {
        try {
          setProviderMode(true);
        } catch {}
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("auth.invalidCredentials"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-4">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center sm:mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white">
              N
            </div>
            <span className="text-2xl font-bold text-gray-900">NoQ</span>
          </Link>
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
            {t("nav.signin")}
          </h2>
          <p className="text-gray-600">{t("auth.signInToAccount")}</p>
        </div>

        <div className="relative rounded-2xl bg-white p-5 shadow-lg sm:p-8">
          <div className="mb-5 flex items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                disabled={isLoading}
                className={`inline-flex h-11 flex-1 items-center justify-center rounded-xl px-3 text-sm font-medium transition whitespace-nowrap sm:px-5 ${
                  selectedRole === "user"
                    ? "bg-[#F49B33] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("auth.roleUser") || "User"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                disabled={isLoading}
                className={`inline-flex h-11 flex-1 items-center justify-center rounded-xl px-3 text-sm font-medium transition whitespace-nowrap sm:px-5 ${
                  selectedRole === "admin"
                    ? "bg-[#F49B33] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("auth.roleAdmin") || "Admin"}
              </button>
            </div>

            <LanguageSwitcher className="shrink-0" />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-6"
            autoComplete="off"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="new-password"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t("auth.emailPlaceholder")}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none focus:ring-2"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={t("auth.passwordPlaceholder")}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-gray-900 outline-none focus:ring-2"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  className="rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">
                  {t("auth.rememberMe")}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-all hover:shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("common.loading")}</span>
                </>
              ) : (
                <span>{t("nav.signin")}</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t("auth.noAccount")}{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              {t("nav.signup")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

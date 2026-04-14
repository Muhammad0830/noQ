"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { API_ENDPOINTS } from "@/lib/api";

type FieldErrors = {
  email: string;
  phone: string;
  confirmPassword: string;
  acceptTerms: string;
};

export default function SignUp() {
  const router = useRouter();
  const { signup } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: "",
    phone: "",
    confirmPassword: "",
    acceptTerms: "",
  });
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const getInputClass = (hasError: boolean) =>
    `w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-gray-900 outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${
      hasError
        ? "border-red-500 focus:ring-red-500 dark:border-red-500"
        : "border-gray-300 focus:ring-blue-500 dark:border-gray-600"
    }`;

  const validateEmail = (email: string) => {
    const value = email.trim();
    if (!value) return t("signup.validation.email.required");
    if (value.includes(" ")) return t("signup.validation.email.noSpace");
    if (!value.includes("@")) return t("signup.validation.email.noAt");

    const [localPart, domainPart] = value.split("@");
    if (!localPart) return t("signup.validation.email.localMissing");
    if (!domainPart) return t("signup.validation.email.domainMissing");
    if (!domainPart.includes(".")) {
      return t("signup.validation.email.noDot");
    }

    const domainSuffix = domainPart.split(".").pop() || "";
    if (domainSuffix.length < 2) {
      return t("signup.validation.email.suffixShort");
    }

    return "";
  };

  const validateUzPhone = (phone: string) => {
    const value = phone.trim();
    const allowedOperatorCodes = [
      "33",
      "50",
      "55",
      "77",
      "88",
      "90",
      "91",
      "93",
      "94",
      "95",
      "97",
      "98",
      "99",
    ];

    if (!value) return t("signup.validation.phone.required");
    if (!value.startsWith("+")) return t("signup.validation.phone.plus");
    if (!value.startsWith("+998"))
      return t("signup.validation.phone.startsWith998");

    const rest = value.slice(4).replace(/[\s()-]/g, "");
    if (!/^\d*$/.test(rest)) {
      return t("signup.validation.phone.invalidChars");
    }

    if (rest.length < 2) {
      return t("signup.validation.phone.noOperatorCode");
    }

    const operatorCode = rest.slice(0, 2);
    if (!allowedOperatorCodes.includes(operatorCode)) {
      return t("signup.validation.phone.invalidOperator");
    }

    if (rest.length < 9) {
      return t("signup.validation.phone.lengthShort");
    }

    if (rest.length > 9) {
      return t("signup.validation.phone.lengthLong");
    }

    return "";
  };

  const checkEmailAlreadyRegistered = async (email: string) => {
    const response = await fetch(
      `${API_ENDPOINTS.auth.checkEmail}?email=${encodeURIComponent(email)}`,
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { exists?: boolean };
    return Boolean(data.exists);
  };

  const handleEmailBlur = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setFieldErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, email: "" }));
    setIsCheckingEmail(true);

    try {
      const exists = await checkEmailAlreadyRegistered(formData.email.trim());
      if (exists) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("signup.email.exists"),
        }));
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const phoneError = validateUzPhone(formData.phone);
    const confirmPasswordError =
      formData.password !== formData.confirmPassword
        ? t("signup.validation.confirmPassword")
        : "";
    const acceptTermsError = formData.acceptTerms
      ? ""
      : t("signup.validation.acceptTerms");

    const nextFieldErrors: FieldErrors = {
      email: emailError,
      phone: phoneError,
      confirmPassword: confirmPasswordError,
      acceptTerms: acceptTermsError,
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      setError(t("signup.validation.fixErrors"));
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const emailExists = await checkEmailAlreadyRegistered(
        formData.email.trim(),
      );
      if (emailExists) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("signup.email.exists"),
        }));
        setError(t("signup.email.exists"));
        return;
      }

      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
      );
      router.push("/");
    } catch (err) {
      if (
        err instanceof Error &&
        /already registered|already exists|already been registered|user already/i.test(
          err.message,
        )
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          email: t("signup.email.exists"),
        }));
      }
      setError(err instanceof Error ? err.message : t("signup.error.general"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-4 dark:bg-[#211201]">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center sm:mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white">
              N
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              NoQ
            </span>
          </Link>
          <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            {t("nav.signup")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("signup.subtitle")}
          </p>
        </div>

        <div className="relative rounded-2xl bg-white p-5 shadow-lg dark:bg-gray-800 sm:p-8">
          <div className="absolute right-3 top-3">
            <LanguageSwitcher />
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-6"
            autoComplete="off"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t("signup.fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("signup.fullNamePlaceholder")}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t("auth.email")}
              </label>
              {fieldErrors.email && (
                <p className="mb-2 text-xs font-medium text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
              {isCheckingEmail && !fieldErrors.email && (
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  {t("signup.checkingEmail")}
                </p>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="new-password"
                  value={formData.email}
                  onBlur={handleEmailBlur}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, email: value });
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        email: validateEmail(value),
                      }));
                    }
                  }}
                  placeholder={t("auth.emailPlaceholder")}
                  className={getInputClass(!!fieldErrors.email)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t("signup.phone")}
              </label>
              {fieldErrors.phone && (
                <p className="mb-2 text-xs font-medium text-red-600 dark:text-red-400">
                  {fieldErrors.phone}
                </p>
              )}
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onBlur={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      phone: validateUzPhone(formData.phone),
                    }))
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, phone: value });
                    if (fieldErrors.phone) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        phone: validateUzPhone(value),
                      }));
                    }
                  }}
                  placeholder={t("signup.phonePlaceholder")}
                  className={getInputClass(!!fieldErrors.phone)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={t("signup.passwordPlaceholder")}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t("signup.confirmPassword")}
              </label>
              {fieldErrors.confirmPassword && (
                <p className="mb-2 text-xs font-medium text-red-600 dark:text-red-400">
                  {fieldErrors.confirmPassword}
                </p>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      confirmPassword: value,
                    });

                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword:
                          formData.password === value
                            ? ""
                            : t("signup.validation.confirmPassword"),
                      }));
                    }
                  }}
                  placeholder={t("signup.confirmPasswordPlaceholder")}
                  className={getInputClass(!!fieldErrors.confirmPassword)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData({ ...formData, acceptTerms: checked });
                  if (fieldErrors.acceptTerms && checked) {
                    setFieldErrors((prev) => ({ ...prev, acceptTerms: "" }));
                  }
                }}
                className="rounded mt-1"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Men{" "}
                <Link
                  href="/user/terms"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Foydalanish shartlari
                </Link>{" "}
                va{" "}
                <Link
                  href="/user/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Maxfiylik siyosati
                </Link>
                ni qabul qilaman
              </span>
            </label>
            {fieldErrors.acceptTerms && (
              <p className="-mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                {fieldErrors.acceptTerms}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t("common.loading")}</span>
                </>
              ) : (
                <span>{t("signup.submit")}</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Hisobingiz bormi?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {t("nav.signin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

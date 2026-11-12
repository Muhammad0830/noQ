"use client";

import type { Route } from "next";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  redirect("/admin/dashboard" as Route);
}

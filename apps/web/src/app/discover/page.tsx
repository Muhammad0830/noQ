import { Suspense } from "react";
import DiscoverServices from "@/components/DiscoverServices";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverServices />
    </Suspense>
  );
}

import { Suspense } from "react";
import DiscoverServices from "./DiscoverServices";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverServices />
    </Suspense>
  );
}

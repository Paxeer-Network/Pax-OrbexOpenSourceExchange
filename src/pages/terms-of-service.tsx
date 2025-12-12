import { useEffect } from "react";
import { useRouter } from "next/router";

export default function TermsOfService() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/terms-and-conditions");
  }, [router]);

  return null;
}

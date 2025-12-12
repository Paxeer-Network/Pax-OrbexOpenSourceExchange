import { useEffect } from "react";
import { useRouter } from "next/router";

export default function About() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/about-us");
  }, [router]);

  return null;
}

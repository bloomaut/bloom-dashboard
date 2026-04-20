import About from "@/features/(public)/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Bloomaut",
  description: "Learn about Bloomaut's mission and founding team.",
  openGraph: {
    title: "About | Bloomaut",
    description: "Learn about Bloomaut's mission and founding team.",
  },
};

export default function AboutPage() {
  return <About />;
}

import { ReactNode } from "react";
import "./globals.css";

interface ErrorProps {
  children: ReactNode;
}

export default function GlobalError({ children }: ErrorProps) {
  return <>{children}</>;
}

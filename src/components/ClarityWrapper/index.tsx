"use client";
import { clarity } from "react-microsoft-clarity";
import { useEffect } from "react";

const ClarityWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    clarity.init(`${process.env.NEXT_CLARITY_ID}`);
  });
  return <>{children}</>;
};

export default ClarityWrapper;

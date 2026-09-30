"use client";

import { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

export default function CookiesWrapper({ children }: { children: ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}

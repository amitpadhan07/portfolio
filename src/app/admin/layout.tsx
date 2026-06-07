import React from "react";
import Providers from "./Providers";

export const metadata = {
  title: "Admin Portal | Portfolio CMS",
  description: "Secure gateway to manage portfolio data and view statistics.",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

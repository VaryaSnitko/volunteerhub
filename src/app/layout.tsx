import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "../contexts/ToastContext";

export const metadata: Metadata = {
  title: "VolunteerHub - Find Volunteering Opportunities",
  description: "Discover and sign up for volunteering opportunities in your community. Connect with organizations and make a difference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        suppressHydrationWarning={true}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/i18n/I18nProvider";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/cel/Navbar";
import { Footer } from "@/components/cel/Footer";

export const metadata: Metadata = {
  title: "RedCopy - AI 小红书爆款文案生成器",
  description: "粘贴文章，AI 帮你提炼精华，生成带 emoji 的人性化小红书爆款文案。Cel-shading style Xiaohongshu copywriting tool.",
  keywords: ["小红书文案", "AI文案", "爆款文案", "RedCopy", "Xiaohongshu", "copywriting"],
  authors: [{ name: "RedCopy Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#fafaf5] text-[#1a1a2e] antialiased">
        <I18nProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { studio } from "@/data/studio";
import "./globals.css";
import "./fonts.css";
import "./theme-dark.css";
import "@/components/workspace/motion.css";
import "@/components/workspace/interface.css";
import "./accessibility.css";
export const metadata: Metadata = {
  metadataBase: new URL(studio.origin), title: { default: "JAGAU — Independent Software Studio", template: "%s — JAGAU" },
  description: studio.positioning, alternates: { canonical: "/" },
  openGraph: { title: "JAGAU — Independent Software Studio", description: studio.positioning, type: "website", url: "/", images: ["/social.png"] },
  twitter: { card: "summary_large_image", images: ["/social.png"] }, icons: { icon: "/icon.svg" },
};
const THEME_BOOT = `(function(){try{var d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)"),k="aw-theme";var s=localStorage.getItem(k);d.dataset.theme=s==="dark"||s==="light"?s:(m.matches?"dark":"light");d.lang="en";m.addEventListener("change",function(e){if(!localStorage.getItem(k))d.dataset.theme=e.matches?"dark":"light"})}catch(e){}})();`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="h-full antialiased" suppressHydrationWarning><head><meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"/><meta name="referrer" content="strict-origin-when-cross-origin"/><script dangerouslySetInnerHTML={{ __html: THEME_BOOT }}/></head><body className="flex min-h-full flex-col"><div className="site-main flex-1">{children}</div></body></html>;
}

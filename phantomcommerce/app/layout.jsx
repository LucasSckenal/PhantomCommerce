import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.scss";
import { SearchProvider } from './contexts/SearchContext';
import { ProductProvider } from "./contexts/ProductContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Phantom Commerce',
  description: 'Sua loja de jogos digitais',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
          <ProductProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </ProductProvider>
      </body>
    </html>
  );
}


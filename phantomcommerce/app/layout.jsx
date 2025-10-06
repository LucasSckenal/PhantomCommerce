import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.scss";
import { SearchProvider } from './contexts/SearchContext';
import { ProductProvider } from "./contexts/ProductContext";
import { StoreProvider } from "./contexts/StoreContext";
import { CartProvider } from "./contexts/CartContext"
import { AuthProvider } from "./contexts/AuthContext"

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
        <AuthProvider>
         <StoreProvider slug="all" initialFilters={{
            sortOrder: 'rating',
            selectedTags: [],
            selectedPlatforms: [],
            priceRange: { min: '', max: '' }
          }}>
          <ProductProvider>
          <SearchProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </SearchProvider>
        </ProductProvider>
        </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


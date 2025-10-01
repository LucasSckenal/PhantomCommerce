"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Bell, User, Menu, X } from "lucide-react";
import styles from "./Header.module.scss";
import CartModal from "../CartModal/CartModal";
import { useSearch } from "../../contexts/SearchContext";

// Dados de exemplo para o carrinho
const initialCartData = [
    { id: 1, name: 'Starlight Odyssey', edition: 'Edição Padrão', price: 124.95, oldPrice: 249.90, image: 'https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

const IconButton = ({ icon: Icon, badge, label, onClick }) => (
  <button className={styles.iconButton} aria-label={label} onClick={onClick}>
    <Icon size={22} />
    {badge > 0 && <span className={styles.badge}>{badge}</span>}
  </button>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Simulação de estado de autenticação
  const [currentUser, setCurrentUser] = useState(null);

  // Simula o login de um usuário após 3 segundos para demonstração
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentUser({
        name: "Ana",
        avatarUrl: "https://i.pravatar.cc/150?img=40" 
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const { 
    searchQuery, 
    searchResults, 
    isResultsVisible, 
    handleSearchSubmit, 
    handleSearchChange, 
    hideSearchResults,
    clearSearch
  } = useSearch();

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        hideSearchResults();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideSearchResults]);

  useEffect(() => {
    setCartItems(initialCartData);
  }, []);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    handleSearchSubmit(searchQuery);
  }

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logoLink}>
              <img src="/logo.svg" alt="Logo da Loja" className={styles.logo} />
            </Link>
          </div>

          <div className={styles.searchSection} ref={searchContainerRef}>
            <form onSubmit={onSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar jogos..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
              </div>
            </form>
            {isResultsVisible && searchResults.length > 0 && (
              <div className={styles.searchResultsContainer}>
                <ul className={styles.searchResultsList}>
                  {searchResults.map((game) => (
                    <li key={game.id}>
                      <Link href={`/product/${game.id}`} className={styles.searchResultItem} onClick={clearSearch}>
                        <div className={styles.resultImageContainer}>
                          <img src={game.bannerImage} alt={`Capa do jogo ${game.title}`} className={styles.resultImage} />
                        </div>
                        <span className={styles.resultTitle}>{game.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.rightItems}>
            <nav className={styles.mainNav}>
              <Link href="/store" className={styles.navLink}>Loja</Link>
              <Link href="/library" className={styles.navLink}>Biblioteca</Link>
              <Link href="/community" className={styles.navLink}>Comunidade</Link>
              <Link href="/help" className={styles.navLink}>Ajuda</Link>
            </nav>
            <div className={styles.userActions}>
              <div className={styles.desktopActions}>
                <IconButton 
                  icon={ShoppingCart} 
                  badge={cartItems.length} 
                  label="Carrinho"
                  onClick={() => setIsCartOpen(true)} 
                />
                <IconButton icon={Bell} badge={3} label="Notificações" />
                {currentUser ? (
                  <Link href="/profile" className={styles.userProfile}>
                    <img src={currentUser.avatarUrl} alt={`Avatar de ${currentUser.name}`} className={styles.userAvatar} />
                  </Link>
                ) : (
                  <Link href="/auth/login" className={styles.userButton}>
                    <User size={18} />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.mobileMenuToggle}>
             <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>

        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <nav className={styles.mobileNav}>
            <Link href="/store" className={styles.mobileNavLink}>Loja</Link>
            <Link href="/library" className={styles.mobileNavLink}>Biblioteca</Link>
            <Link href="/community" className={styles.mobileNavLink}>Comunidade</Link>
            <Link href="/help" className={styles.mobileNavLink}>Ajuda</Link>
            {currentUser ? (
               <Link href="/profile" className={styles.mobileUserButton}>
                  <img src={currentUser.avatarUrl} alt={`Avatar de ${currentUser.name}`} className={styles.userAvatar} />
                  <span>Minha Conta</span>
                </Link>
            ) : (
              <Link href="/auth/login" className={styles.mobileUserButton}>
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
        onUpdateQuantity={(id, newQuantity) => {
          if (newQuantity === 0) {
            setCartItems(prev => prev.filter(item => item.id !== id));
          }
        }}
      />
    </>
  );
}


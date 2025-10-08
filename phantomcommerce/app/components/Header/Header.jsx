'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Loader2 } from "lucide-react";
import styles from "./Header.module.scss";
import CartModal from "../CartModal/CartModal";
import { useSearch } from "../../contexts/SearchContext";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext"; // 1. Importar o hook de autenticação

// Dados mocados para categorias (podem ser substituídos por uma API no futuro)
const categories = [
  { name: "Ação", slug: "acao" },
  { name: "Aventura", slug: "aventura" },
  { name: "RPG", slug: "rpg" },
  { name: "Estratégia", slug: "estrategia" },
  { name: "Simulação", slug: "simulacao" },
];

const IconButton = ({ icon: Icon, badge, label, onClick }) => (
  <button className={styles.iconButton} aria-label={label} onClick={onClick}>
    <Icon size={22} />
    {badge > 0 && <span className={styles.badge}>{badge}</span>}
  </button>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // 2. Usar os contextos
  const { currentUser, logout } = useAuth();
  const { isCartOpen, cartItems, handleCartClick, closeCart, removeFromCart} = useCart();
  const {
    searchQuery,
    searchResults,
    isResultsVisible,
    isSearching,
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch
  } = useSearch();

  const searchContainerRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        hideSearchResults();
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideSearchResults]);


  const onSearchSubmit = (event) => {
    event.preventDefault();
    handleSearchSubmit(searchQuery);
  }

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
  };

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

            {isResultsVisible && (
              <div className={styles.searchResultsContainer}>
                {isSearching ? (
                  <div className={styles.searchFeedback}>
                    <Loader2 size={16} className={styles.loaderIcon} />
                    <span>Buscando...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className={styles.searchResultsList}>
                    {searchResults.map((game) => (
                      <li key={game.id}>
                        <Link href={`/product/${game.id}`} className={styles.searchResultItem} onClick={clearSearch}>
                          <div className={styles.resultImageContainer}>
                            <img src={game.coverImageUrl || game.headerImageUrl} alt={`Capa do jogo ${game.title}`} className={styles.resultImage} />
                          </div>
                          <span className={styles.resultTitle}>{game.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.searchFeedback}>
                    <span>Nenhum resultado encontrado.</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={styles.rightItems}>
            <nav className={styles.mainNav}>
              <Link href="/" className={styles.navLink}>Loja</Link>
              <div className={styles.categoryMenu} ref={categoryMenuRef}>
                <button
                  className={`${styles.navLink} ${styles.categoryButton}`}
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                >
                  Categorias
                  <ChevronDown size={16} className={`${styles.chevronIcon} ${isCategoryMenuOpen ? styles.open : ''}`} />
                </button>
                {isCategoryMenuOpen && (
                  <div className={styles.categoryDropdown}>
                    <ul className={styles.categoryList}>
                       <li>
                          <Link href="/category/all" className={styles.categoryItem} onClick={() => setIsCategoryMenuOpen(false)}>
                            Ver Todas
                          </Link>
                        </li>
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/category/${category.slug}`}
                            className={styles.categoryItem}
                            onClick={() => setIsCategoryMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </nav>

            <div className={styles.userActions}>
              <div className={styles.desktopActions}>
                <IconButton icon={ShoppingCart} badge={cartItems.length} label="Carrinho" onClick={handleCartClick} />
                <IconButton icon={Heart} badge={3} label="Notificações" />
                
                {/* 3. Lógica de autenticação dinâmica */}
                {currentUser ? (
                  <div className={styles.userProfile} ref={profileMenuRef}>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={styles.userAvatarButton}>
                      <img 
                        src={currentUser.photoURL || '/default-avatar.svg'} 
                        alt={`Avatar de ${currentUser.displayName || 'Utilizador'}`}
                        className={styles.userAvatar} 
                        onError={(e) => { e.currentTarget.src = '/default-avatar.svg'; }} // Fallback para imagem quebrada
                      />
                    </button>
                    {isProfileMenuOpen && (
                      <div className={styles.profileDropdown}>
                         <div className={styles.profileInfo}>
                            <strong>{currentUser.displayName || 'Bem-vindo(a)!'}</strong>
                            <span>{currentUser.email}</span>
                        </div>
                        <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsProfileMenuOpen(false)}>
                            Minha Conta
                        </Link>
                        <button onClick={handleLogout} className={styles.dropdownItem}>
                            Sair
                        </button>
                      </div>
                    )}
                  </div>
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
             <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>

        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <nav className={styles.mobileNav}>
            <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Loja</Link>
            <Link href="/category/all" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Categorias</Link>
            {currentUser ? (
              <>
               <Link href="/profile" className={styles.mobileUserButton} onClick={() => setIsMenuOpen(false)}>
                  <img src={currentUser.photoURL || '/default-avatar.svg'} alt={`Avatar de ${currentUser.displayName}`} className={styles.userAvatar} />
                  <span>Minha Conta</span>
                </Link>
                <button onClick={handleLogout} className={`${styles.mobileNavLink} ${styles.logoutButton}`}>
                    Sair
                </button>
              </>
            ) : (
              <Link href="/auth/login" className={styles.mobileUserButton} onClick={() => setIsMenuOpen(false)}>
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
      />
    </>
  );
}

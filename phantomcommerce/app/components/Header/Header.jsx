"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// Importando todos os ícones necessários
import { Search, ShoppingCart, Bell, User, Menu, X, ChevronDown, Loader2 } from "lucide-react";
import styles from "./Header.module.scss";
import CartModal from "../CartModal/CartModal";
import { useSearch } from "../../contexts/SearchContext";

// Dados mocados (substituir por contextos ou APIs no futuro)
const initialCartData = [
    { id: 1, name: 'Starlight Odyssey', edition: 'Edição Padrão', price: 124.95, oldPrice: 249.90, image: 'https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const {
    searchQuery,
    searchResults,
    isResultsVisible,
    isSearching, // Estado de carregamento da busca
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch
  } = useSearch();

  const searchContainerRef = useRef(null);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentUser({
        name: "Ana",
        avatarUrl: "https://i.pravatar.cc/150?img=40"
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
                            <img src={game.bannerImage} alt={`Capa do jogo ${game.title}`} className={styles.resultImage} />
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
              <Link href="/store" className={styles.navLink}>Loja</Link>
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
                <IconButton icon={ShoppingCart} badge={cartItems.length} label="Carrinho" onClick={() => setIsCartOpen(true)} />
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
             <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>

        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <nav className={styles.mobileNav}>
            <Link href="/store" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Loja</Link>
            <Link href="/category/all" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Categorias</Link>
            {currentUser ? (
               <Link href="/profile" className={styles.mobileUserButton} onClick={() => setIsMenuOpen(false)}>
                  <img src={currentUser.avatarUrl} alt={`Avatar de ${currentUser.name}`} className={styles.userAvatar} />
                  <span>Minha Conta</span>
                </Link>
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
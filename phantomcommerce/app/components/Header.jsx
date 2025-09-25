"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Bell, User, Menu, X } from "lucide-react";
import styles from "../styles/Header.module.scss";

const IconButton = ({ icon: Icon, badge, label, onClick }) => (
  <button className={styles.iconButton} aria-label={label} onClick={onClick}>
    <Icon size={22} />
    {badge > 0 && <span className={styles.badge}>{badge}</span>}
  </button>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar por:", searchQuery);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <img className={styles.logoIcon} src="/logo.png" alt="Logo da Minha Empresa" />
            <span className={styles.logoText}>PhantomCommerce</span>
          </Link>
        </div>

        {/* Search */}
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar jogos, produtos e mais..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Navigation + Actions */}
        <div className={styles.navSection}>
          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            <Link href="#" className={styles.navLink}>Loja</Link>
            <Link href="#" className={styles.navLink}>Biblioteca</Link>
            <Link href="#" className={styles.navLink}>Comunidade</Link>
          </nav>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <IconButton icon={ShoppingCart} badge={3} label="Carrinho" />
            <IconButton icon={Bell} badge={5} label="Notificações" />
            <button className={styles.userButton} aria-label="Entrar">
              <User size={18} />
              <span>Entrar</span>
            </button>
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <nav className={styles.mobileNav}>
          <Link href="#" className={styles.mobileNavLink}>Loja</Link>
          <Link href="#" className={styles.mobileNavLink}>Biblioteca</Link>
          <Link href="#" className={styles.mobileNavLink}>Comunidade</Link>
          <Link href="#" className={styles.mobileNavLink}>Ajuda</Link>
          <button className={styles.mobileUserButton}>
            <User size={18} />
            <span>Entrar</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

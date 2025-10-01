"use client";
import { useEffect } from "react";
import { Trash2, ShoppingCart, X } from "lucide-react";
import styles from "./CartModal.module.scss";

// --- Modal ---
const CartModal = ({
  isOpen,
  onClose = () => {},
  cartItems = [],
  onRemoveItem = () => {},
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.oldPrice || item.price),
    0
  );
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discounts = subtotal - total;

  return (
    <div
      className={styles.cartModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${styles.cartModal} ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isOpen}
      >
        {/* Cabeçalho */}
        <header className={styles.headerContainer}>
          <h2 className="text-2xl font-bold tracking-wider text-white">
            SEU CARRINHO
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar carrinho"
          >
            <X size={24} />
          </button>
        </header>

        {/* Conteúdo */}
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
            <ShoppingCart size={96} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-400">
              Seu carrinho está vazio
            </h3>
            <p className="text-gray-500 mt-2">Adicione jogos para vê-los aqui.</p>
          </div>
        ) : (
          <>
            {/* Lista */}
            <div className={`${styles.cartItemsList} ${styles.customScrollbar}`}>
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.cartItemCard}
                  style={{ animationDelay: `${100 + index * 100}ms` }}
                >
                  {/* Imagem na esquerda */}
                  <div className={styles.itemImageContainer}>
                    <img
                      src={item.image}
                      alt={`Capa de ${item.name}`}
                      className={styles.itemImage}
                    />
                  </div>

                  {/* Conteúdo textual no centro */}
                  <div className={styles.itemContent}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemEdition}>{item.edition}</p>
                    </div>
                    <div className={styles.priceContainer}>
                      <span className={styles.currentPrice}>
                        {formatCurrency(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className={styles.oldPrice}>
                          {formatCurrency(item.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lixeira na direita (agora absoluta no card) */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className={styles.removeButton}
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Rodapé */}
            <footer className={styles.cartFooter}>
              <div className={styles.footerContent}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className={styles.row}>
                  <span>Descontos</span>
                  <span className={styles.discount}>- {formatCurrency(discounts)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button className={styles.checkoutButton}>
                FINALIZAR COMPRA
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

// --- Formatação ---
const formatCurrency = (value) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default CartModal;
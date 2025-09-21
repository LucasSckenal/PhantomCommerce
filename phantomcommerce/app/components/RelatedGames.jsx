import styles from "@/app/styles.module.scss";
import Image from "next/image";

const games = [
  { id: 1, name: "Dark Souls III", price: "R$ 99,00", img: "/dark.jpg" },
  { id: 2, name: "Dark Souls III", price: "R$ 99,00", img: "/dark.jpg" },
  { id: 3, name: "Dark Souls III", price: "R$ 99,00", img: "/dark.jpg" },
  { id: 4, name: "Dark Souls III", price: "R$ 99,00", img: "/dark.jpg" },
];

export default function RelatedGames() {
  return (
    <div className={styles.gamesGrid}>
      {games.map((game) => (
        <div key={game.id} className={styles.card}>
          <Image
            src={game.img}
            alt={game.name}
            width={250}
            height={300}
            className={styles.cardImg}
          />
          <h4>{game.name}</h4>
          <p>{game.price}</p>
          <button className={styles.buyBtn}>Comprar</button>
        </div>
      ))}
    </div>
  );
}

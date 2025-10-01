"use client";

import styles from "./styles/NotFound.module.scss";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>404</h1>
        <h2>ERROR</h2>
        <p>PAGE NOT FOUND</p>

        <Link href="/" className={styles.goBack}>
          GO BACK
        </Link>
      </div>
    </div>
  );
}

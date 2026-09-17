import Link from "next/link";
import styles from "./not-found.module.css";

// No 404/catch-all route existed in the old React Router setup; this is a
// new, minimal, required Next.js convention file (App Router renders this
// automatically for any unmatched route).
export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link href="/" className={styles.link}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

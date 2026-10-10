import Link from "next/link";
import styles from "./not-found.module.css";
export default function NotFound() {
  return <main className={styles.page} id="main">
    <Link href="/" className={styles.brand} aria-label="JAGAU home">JAGAU</Link>
    <p className={styles.code}>404 / Page not found</p>
    <h1>This page is not part of JAGAU.</h1>
    <p>The workspace is still here. Return to the studio, explore the projects, or ask the Guide about the work.</p>
    <Link href="/" className={styles.return}>Open JAGAU Workspace <span aria-hidden="true">↗</span></Link>
  </main>;
}

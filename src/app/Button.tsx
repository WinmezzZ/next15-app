'use client'
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <div className={styles.page}>
     <button onClick={() => setCount(count => count + 1)}>{count}</button>
    </div>
  );
}

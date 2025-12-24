import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa"; // Ikonka kerak
import styles from "./BackToTop.module.scss";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Skrollni kuzatish funksiyasi
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Tepaga silliq chiqish funksiyasi
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`${styles.backToTop} ${isVisible ? styles.visible : ""}`}>
      <button onClick={scrollToTop} aria-label="Tepaga qaytish">
        <FaArrowUp />
      </button>
    </div>
  );
}
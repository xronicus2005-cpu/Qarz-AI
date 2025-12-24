import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sahifa o'zgarganda (pathname) oynani 0 pikselga (tepaga) ko'taradi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Hech narsa chizmaydi
}
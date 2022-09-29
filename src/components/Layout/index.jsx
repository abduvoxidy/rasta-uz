import { Footer } from "components/UI/Footer/Footer";
import { Header } from "components/UI/Header/Header";
import { useRegionByPoint } from "hooks/useRegionByPoint";
import { useEffect } from "react";
import { getUserLastOrder } from "utils/userDetails";
import { loadYandexMap } from "utils/yandexMapUtils";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import UnavailableShipper from "components/UI/UnavailableShipper/UnavailableShipper";
import RateShipping from "components/UI/RateShipping/RateShipping";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    loadYandexMap("ru");
    getUserLastOrder();
  }, []);

  useRegionByPoint();

  const routePaths = ["/login", "/register"];

  return (
    <>
      {!routePaths.includes(router.pathname) && <Header />}
      {children}
      {!routePaths.includes(router.pathname) && <Footer />}
      <UnavailableShipper />
      <RateShipping />
    </>
  );
}

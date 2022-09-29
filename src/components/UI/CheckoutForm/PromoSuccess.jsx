import { useEffect } from "react";
import Lottie from "react-lottie";
import * as animationData from "../../../../public/gif/success-promo.json";
import cls from "./CheckoutForm.module.scss";

export default function PromoSuccess() {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div className={cls.successPromo}>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
}

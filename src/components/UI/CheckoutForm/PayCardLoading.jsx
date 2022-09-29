import Lottie from "react-lottie";
import * as animationData from "../../../../public/gif/pay-card-loading.json";
import cls from "./CheckoutForm.module.scss";

export default function PayCardLoading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={cls.payCardLoading}>
      <Lottie options={defaultOptions} height={275} width={275} />
    </div>
  );
}

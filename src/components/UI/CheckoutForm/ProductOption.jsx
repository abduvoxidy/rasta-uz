import { useDispatch, useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";
import { decrement, increment, setProduct } from "store/cart/cartSlice";
import numberToPrice from "utils/numberToPrice";
import cls from "./CheckoutForm.module.scss";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import CartButton from "../Cart/CartButton";

export default function ProductOption({ item }) {
  const { t, lang } = useTranslation("common");
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [productOptionId, setProductOptionId] = useState(null);
  const currentProduct = useMemo(() => {
    if (productOptionId) {
      const isHas = cartItems.find(
        (item) => item.productOptionId === productOptionId
      );
      if (isHas) {
        return isHas;
      }
      return null;
    }
    return null;
  }, [cartItems, productOptionId]);

  useEffect(() => {
    if (item) {
      const product = { ...item };
      let activeOption = null;
      let activeChildOption = null;
      if (product && product.options) {
        activeOption = product.options.find((item) => item.is_default);
        activeChildOption = activeOption?.child_options
          ? activeOption?.child_options
              .filter((item) => item.is_required)
              .find((value) => value.is_default)
          : null;
      }

      let productOptionIds = product.id;

      if (activeOption) {
        productOptionIds = productOptionIds + activeOption.id;
      }

      if (activeChildOption) {
        productOptionIds = productOptionIds + activeChildOption.id;
      }

      setProductOptionId(productOptionIds);
    }
  }, []);

  const addToCart = (value) => {
    const product = { ...value };
    let activeOption = null;
    let activeChildOption = null;
    if (value && value.options) {
      activeOption = value.options.find((item) => item.is_default);
      activeChildOption = activeOption?.child_options
        ? activeOption?.child_options
            .filter((item) => item.is_required)
            .find((value) => value.is_default)
        : null;
    }

    delete product.options;

    let productOptionId = product.id;

    if (activeOption) {
      productOptionId = productOptionId + activeOption.id;
    }
    if (activeChildOption) {
      productOptionId = productOptionId + activeChildOption.id;
    }

    dispatch(
      setProduct({
        ...product,
        option: activeOption
          ? {
              ...activeOption,
              child_options: activeChildOption ? [activeChildOption] : [],
            }
          : null,
        quantity: 1,
        productOptionId,
        totalPrice: product.price_with_option,
      })
    );
  };
  return (
    <div className={cls.product}>
      <div className={cls.item}>
        <div className={cls.img}>
          <Image src={item.image} layout="fill" objectFit="cover" />
        </div>
        <div className={cls.body}>
          <p>{item.name && item.name[lang]}</p>

          {currentProduct ? (
            <CartButton
              className={cls.buttons}
              size={38}
              increment={() => {
                dispatch(increment(currentProduct.productOptionId));
              }}
              decrement={() => {
                dispatch(decrement(currentProduct.productOptionId));
              }}
              count={currentProduct.quantity}
            />
          ) : (
            <button onClick={() => addToCart(item)}>
              {numberToPrice(item.price_with_option, t("soum"))}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

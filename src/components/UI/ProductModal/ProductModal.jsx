import {
  Dialog,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Slide,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { forwardRef, useEffect, useMemo, useState } from "react";
import GreenButton from "../Buttons/GreenButton";
import { CloseIcon } from "../Icons";
import cls from "./ProductModal.module.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import CartButton from "../Cart/CartButton";
import numberToPrice from "utils/numberToPrice";
import Checkbox from "components/UI/Forms/Checkbox";
import Radio from "components/UI/Forms/Radio";
import { setProduct } from "store/cart/cartSlice";
import { useDispatch } from "react-redux";
import { useStyles } from "./styles";
import { useRouter } from "next/router";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductModal({ handleClose, open, item }) {
  const [option, setOption] = useState(null);
  const [childOption, setChildOption] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [scrollY, setScrollY] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const [count, setCount] = useState(1);
  const { t, lang } = useTranslation("common");
  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const classes = useStyles();

  const decrement = () => {
    if (count > 1) setCount((prev) => prev - 1);
  };
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    if (item.data) {
      const ingredientsPrice = ingredients.reduce((a, b) => {
        return a + b.price;
      }, 0);
      const optionPrice = option ? option.price : 0;
      const childOptionPrice = childOption ? childOption.price : 0;
      return (
        item.data.price + ingredientsPrice + optionPrice + childOptionPrice
      );
    } else {
      return 0;
    }
  }, [ingredients, item.data, childOption, option]);

  useEffect(() => {
    if (item.data && item.data.options) {
      const activeOption = item.data.options.find((item) => item.is_default);
      const activeChildOption = activeOption?.child_options
        ? activeOption?.child_options
            .filter((item) => item.is_required)
            .find((value) => value.is_default)
        : null;
      setOption(activeOption);
      if (activeChildOption) {
        setChildOption(activeChildOption);
      } else {
        setChildOption(null);
      }
    }
    setCount(1);
  }, [item.data]);

  const onChange = (list, id, action) => {
    if (action === "option") {
      const activeOption = list.find((item) => item.id === id);
      const activeChildOption = activeOption.child_options
        ? activeOption.child_options.filter((item) => item.is_required)
        : null;
      setOption(activeOption);
      setIngredients([]);
      setChildOption(activeChildOption[0]);
    } else {
      setChildOption(list.find((item) => item.id === id));
    }
  };

  const onChangeIngredients = (id) => {
    const ingredient = ingredients.find((val) => val.id === id);
    if (ingredient) {
      setIngredients((prev) => prev.filter((value) => value.id !== id));
    } else {
      const activeIngredient = option.child_options
        .filter((item) => !item.is_required)
        .find((value) => value.id === id);
      setIngredients((prev) => [...prev, activeIngredient]);
    }
  };

  const addToCart = () => {
    const product = { ...item.data };
    delete product.options;
    let productOptionId = product.id;
    if (option) {
      productOptionId = productOptionId + option.id;
    }
    if (childOption) {
      productOptionId = productOptionId + childOption.id;
    }
    if (ingredients.length > 0) {
      productOptionId =
        productOptionId + ingredients.map((item) => item.id).join("");
    }
    dispatch(
      setProduct({
        ...product,
        option: option
          ? {
              ...option,
              child_options: childOption
                ? [childOption, ...ingredients]
                : [...ingredients],
            }
          : null,
        quantity: count,
        productOptionId,
        totalPrice,
      })
    );
    handleClose();
    setOption(null);
    setChildOption(null);
    setIngredients([]);
  };

  return (
    <>
      <Dialog
        className={classes.root}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className={`${cls.header} ${scrollY > 220 ? cls.visibleHeader : ""}`}
        >
          <span>{item?.data?.name && item?.data?.name[lang]}</span>
          <div onClick={handleClose} className={cls.closeModal}>
            <button>
              <CloseIcon />
            </button>
          </div>
        </div>
        <PerfectScrollbar
          className={cls.scrollBar}
          onScrollY={(e) => {
            setScrollY(e.scrollTop);
          }}
        >
          <aside className={cls.dialog}>
            <div className={cls.close} onClick={handleClose}>
              <button>
                <CloseIcon />
              </button>
            </div>
            <div
              className={cls.img}
              style={{
                height: 300 - scrollY / 2,
                opacity: scrollY <= 290 ? 1 - scrollY / 290 : 0,
              }}
            >
              {item?.data?.image && (
                <Image
                  src={item?.data?.image}
                  layout="fill"
                  objectFit={
                    router.query.id === "573e870f-deb7-4db9-85ed-64444fe4d6a8"
                      ? "contain"
                      : "cover"
                  }
                />
              )}
            </div>
            <div className={cls.body}>
              <div className={cls.mobileTitle}>
                <p className={cls.name}>
                  {item?.data?.name && item?.data?.name[lang]}
                </p>
              </div>
              <p className={cls.desc}>
                {item?.data?.description && item?.data?.description[lang]}
              </p>
              {item.data?.options && item.data?.options?.length > 0 && (
                <>
                  <p className={cls.optionName}>{t("select_category")}</p>
                  <div className={cls.options}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                      >
                        {item.data.options.map((value) => (
                          <div
                            key={value.id}
                            className={cls.option}
                            onClick={(e) => {
                              onChange(item.data.options, value.id, "option");
                            }}
                          >
                            <div className={cls.name}>
                              <Radio
                                checked={
                                  option ? value.id === option.id : false
                                }
                              />
                              {/* <FormControlLabel
                                value={value.id}
                                checked={
                                  option ? value.id === option.id : false
                                }
                                control={<Radio />}
                              /> */}
                              {value.name && value.name[lang]}
                            </div>
                            <div className={cls.price}>
                              {numberToPrice(value.price, t("soum"))}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div>
                </>
              )}

              {option &&
                option?.child_options?.filter((val) => val.is_required).length >
                  0 && (
                  <>
                    <p className={cls.optionName}>{t("select_type")}</p>

                    <div className={cls.options}>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                        >
                          {option.child_options
                            .filter((val) => val.is_required)
                            .map((value) => (
                              <div
                                key={value.id}
                                className={cls.option}
                                onClick={() =>
                                  onChange(option.child_options, value.id)
                                }
                              >
                                <div className={cls.name}>
                                  <FormControlLabel
                                    value={value.id}
                                    checked={
                                      childOption
                                        ? value.id === childOption.id
                                        : false
                                    }
                                    control={<Radio />}
                                  />
                                  {value.name && value.name[lang]}
                                </div>
                                <div className={cls.price}>
                                  {numberToPrice(value.price, t("soum"))}
                                </div>
                              </div>
                            ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </>
                )}
              {option &&
                option.child_options?.filter((val) => !val.is_required).length >
                  0 && (
                  <>
                    <p className={cls.optionName}>{t("ingredient")}</p>
                    <div className={cls.options}>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                        >
                          {option.child_options
                            .filter((val) => !val.is_required)
                            .map((value) => (
                              <div
                                key={value.id}
                                className={cls.option}
                                onClick={() => onChangeIngredients(value.id)}
                              >
                                <div className={cls.name}>
                                  <Checkbox
                                    checked={ingredients
                                      .map((val) => val.id)
                                      .includes(value.id)}
                                    value={value.id}
                                  />

                                  {value.name && value.name[lang]}
                                </div>
                                <div className={cls.price}>
                                  {numberToPrice(value.price, t("soum"))}
                                </div>
                              </div>
                            ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </>
                )}
            </div>
          </aside>
        </PerfectScrollbar>
        <div
          className={cls.order}
          style={{
            boxShadow: option ? "0px -2px 10px rgba(0, 0, 0, 0.06)" : "none",
          }}
        >
          <CartButton
            className={cls.orderBtn}
            size={40}
            count={count}
            increment={increment}
            decrement={decrement}
          />
          <GreenButton
            className={cls.btn}
            size="small"
            fullWidth
            onClick={addToCart}
          >
            {t("add")}
            <p>{numberToPrice(count * totalPrice, t("soum"))}</p>
          </GreenButton>
        </div>
      </Dialog>
    </>
  );
}

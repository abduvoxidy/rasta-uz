import cls from "./ProductCollection.module.scss";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import useTranslation from "next-translate/useTranslation";
import { SampleNextArrow, SamplePrevArrow } from "../Arrows/Arrows";
import { responsive } from "./responsiveSlick";
import { RightArrowIcon } from "../Icons";
import { useRouter } from "next/router";

export default function ProductCollection({ id, title, products }) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    lazyLoad: true,
    responsive,
    nextArrow: <SampleNextArrow styles={cls.sliderArrow} />,
    prevArrow: <SamplePrevArrow styles={cls.sliderArrow} />,
  };

  return (
    <div className={cls.list}>
      <div className={cls.cardHead}>
        <p className={cls.title}>{title}</p>
        <button
          onClick={() => {
            router.push(`/products/${id}`);
          }}
          className={cls.btnCard}
        >
          <p>{t("all")} </p> <RightArrowIcon fill="#B0BABF" />
        </button>
      </div>
      <div className={cls.slider}>
        <Slider {...settings}>
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/restaurant/${item.shipper_id}?product_id=${item.id}`}
            >
              <a>
                <div className={cls.item}>
                  <div className={cls.card}>
                    <div className={cls.img}>
                      <Image src={item.image} objectFit="cover" layout="fill" />
                    </div>
                    <div className={cls.body}>
                      <p>{item.name && item.name[lang]}</p>
                      <p>{item.menu_name && item.menu_name[lang]}</p>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
}

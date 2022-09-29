import cls from "./RestaurantList.module.scss";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import Slider from "react-slick";
import useTranslation from "next-translate/useTranslation";
import { SampleNextArrow, SamplePrevArrow } from "../Arrows/Arrows";
import ListLoading from "./ListLoading";
import { RightArrowIcon } from "../Icons";
import { responsive } from "./responsiveSlick";
import { useRouter } from "next/router";

export default function RestaurantList({
  title,
  comlumnsCount = 4,
  id,
  list,
  isSlider = false,
  isLoading = false,
}) {
  const router = useRouter();
  const { t } = useTranslation("common");

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: comlumnsCount,
    slidesToScroll: 1,
    responsive,
    nextArrow: <SampleNextArrow styles={cls.sliderArrow} />,
    prevArrow: <SamplePrevArrow styles={cls.sliderArrow} />,
  };

  return (
    <div className={cls.list}>
      <div className={cls.cardHead}>
        <p className={cls.title}>{title}</p>
        {isSlider ? (
          <button
            onClick={() => {
              router.push(`/restaurants/${id}`);
            }}
            className={cls.btnCard}
          >
            <p>{t("all")} </p> <RightArrowIcon fill="#B0BABF" />
          </button>
        ) : (
          <></>
        )}
      </div>
      {isSlider ? (
        <div className={cls.slider}>
          <Slider {...settings}>
            {isLoading ? (
              <ListLoading />
            ) : (
              list?.map((item) => (
                <RestaurantCard
                  key={item.id}
                  item={item}
                  className={cls.sliderCard}
                />
              ))
            )}
          </Slider>
        </div>
      ) : (
        <div className={cls.items}>
          {isLoading ? (
            <ListLoading className={cls.item} />
          ) : (
            list?.map((item) => (
              <RestaurantCard className={cls.item} key={item.id} item={item} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

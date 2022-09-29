import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";
import Slider from "react-slick";
import { useBanner } from "services";
import { useRouter } from "next/router";
import { SampleNextArrow, SamplePrevArrow } from "../Arrows/Arrows";
import cls from "./Banner.module.scss";

export default function Banner() {
  const router = useRouter();
  const { lang } = useTranslation("common");

  const regionId = useSelector((state) => state.common.regionId);
  const { banners } = useBanner({
    bannerParams: {
      region_id: regionId,
    },
  });

  const isBanner = banners?.data && banners?.data?.banners.length;

  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: isBanner === 1 ? 1 : 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
          centerMode: true,
          arrows: false,
          infinite: true,
          autoplay: true,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <div className={cls.banner} id="banner">
        {isBanner === 0 ? (
          <></>
        ) : (
          <Slider
            className={`bannerSlick ${isBanner === 1 ? "oneSlide" : ""}`}
            {...settings}
          >
            {banners.isLoading
              ? Array(2)
                  .fill("")
                  .map((_, index) => (
                    <div
                      className={cls.slideItem}
                      key={index + "banner-skleton"}
                    >
                      <Skeleton
                        height="100%"
                        width="100%"
                        style={{ transform: "scale(1)" }}
                      />
                    </div>
                  ))
              : banners?.data?.banners.map((item, index) => (
                  <div className={cls.slideItem} key={index}>
                    <div
                      onClick={() => {
                        if (item.description[lang]) {
                          router.push(`/block-post/${item?.id}`);
                        } else {
                          router.push(`/restaurant/${item?.shipper_id}`);
                        }
                      }}
                      className={cls.img}
                    >
                      <Image
                        src={item.image}
                        alt="banner"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                ))}
          </Slider>
        )}
      </div>
    </>
  );
}

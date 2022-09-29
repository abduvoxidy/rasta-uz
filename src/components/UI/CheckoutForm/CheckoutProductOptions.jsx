import Slider from "react-slick";
import useTranslation from "next-translate/useTranslation";
import { useProduct } from "services";
import { SampleNextArrow, SamplePrevArrow } from "../Arrows/Arrows";
import cls from "./CheckoutForm.module.scss";
import ProductOption from "./ProductOption";

export default function CheckoutProductOptions({ branchId, productIds }) {
  const { t } = useTranslation("common");

  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const { relatedProducts } = useProduct({
    relatedProductsParams: {
      branch_id: branchId,
      product_ids: productIds,
    },
  });

  return relatedProducts.data && relatedProducts.data.products?.lenght > 0 ? (
    <CheckoutCard title={t("something_else")}>
      <div className={cls.options}>
        <Slider {...settings} className="related-products-slider">
          {relatedProducts?.data?.products?.map((item) => (
            <ProductOption item={item} />
          ))}
        </Slider>
      </div>
    </CheckoutCard>
  ) : (
    <></>
  );
}

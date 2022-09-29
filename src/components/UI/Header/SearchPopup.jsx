import numberToPrice from "utils/numberToPrice";
import useTranslation from "next-translate/useTranslation";
import cls from "./Header.module.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import Link from "next/link";

export default function SearchPopup({
  modalRef,
  searchedProducts,
  closeModal,
  onlyProducts = false,
  products,
}) {
  const { t, lang } = useTranslation("common");

  return (
    <div
      className={`${cls.searchPopup} ${
        onlyProducts ? cls.searchRestaurant : ""
      }`}
      ref={modalRef}
    >
      <div className={`${cls.scrollBar} scrollBar`}>
        {!onlyProducts ? (
          <div className={cls.searchList}>
            {searchedProducts?.shippers_by_search?.shippers && (
              <>
                <p>{t("restaurants")}</p>
                <div className={cls.restaurantList}>
                  {searchedProducts?.shippers_by_search?.shippers?.map(
                    (item) => (
                      <Link
                        key={item.id}
                        href={item.is_active ? `/restaurant/${item.id}` : "#"}
                      >
                        <a
                          onClick={closeModal}
                          className={!item.is_active ? cls.disabled : ""}
                        >
                          <div className={cls.restaurantItem}>
                            <div className={cls.img}>
                              <img src={item.logo} alt={item.name} />
                            </div>
                            <div className={cls.text}>
                              <span>{item.name}</span>
                              <span>{item.description}</span>
                            </div>
                          </div>
                        </a>
                      </Link>
                    )
                  )}
                </div>
              </>
            )}
            {searchedProducts?.shippers_with_products_by_search?.shippers && (
              <>
                <p>{t("products")}</p>
                <div className={cls.restaurantList}>
                  {searchedProducts?.shippers_with_products_by_search?.shippers?.map(
                    (item) => (
                      <div key={item.id + "shipper"}>
                        <Link
                          href={item.is_active ? `/restaurant/${item.id}` : "#"}
                        >
                          <a
                            onClick={closeModal}
                            className={!item.is_active ? cls.disabled : ""}
                          >
                            <div className={cls.restaurantItem} key={item.id}>
                              <div className={cls.img}>
                                <img src={item.logo} alt={item.name} />
                              </div>
                              <div className={cls.text}>
                                <span>{item.name}</span>
                                <span>{item.description}</span>
                              </div>
                            </div>
                          </a>
                        </Link>
                        <div className={cls.productList}>
                          {item.products.map((product) => (
                            <Link
                              href={
                                product.is_active
                                  ? `/restaurant/${item.id}?product_id=${product.id}`
                                  : "#"
                              }
                            >
                              <a
                                onClick={closeModal}
                                className={
                                  !product.is_active ? cls.disabled : ""
                                }
                              >
                                <div className={cls.product} key={product.id}>
                                  <div className={cls.img}>
                                    <img
                                      src={product.image}
                                      alt={product.name && product.name[lang]}
                                    />
                                  </div>
                                  <div className={cls.text}>
                                    <span>
                                      {product.name && product.name[lang]}
                                    </span>
                                    <span>
                                      {product.description &&
                                        product.description[lang]}
                                    </span>
                                    <span>
                                      {numberToPrice(
                                        product.price_with_option,
                                        t("soum")
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          products && (
            <div className={cls.searchList}>
              <p>{t("products")}</p>
              <div className={cls.productList}>
                {products?.map((product) => {
                  return (
                    <Link
                      href={
                        product.is_active
                          ? `/restaurant/${product.shipper_id}?product_id=${product.id}`
                          : "#"
                      }
                    >
                      <a
                        onClick={closeModal}
                        className={!product.is_active ? cls.disabled : ""}
                      >
                        <div className={cls.product} key={product.id}>
                          <div className={cls.img}>
                            <img
                              src={product.image}
                              alt={product.name && product.name[lang]}
                            />
                          </div>
                          <div className={cls.text}>
                            <span>{product.name && product.name[lang]}</span>
                            <span>
                              {product.description && product.description[lang]}
                            </span>
                            <span>
                              {numberToPrice(
                                product.price_with_option,
                                t("soum")
                              )}
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          )
        )}
        {!products &&
        !searchedProducts?.shippers_by_search?.shippers &&
        !searchedProducts?.shippers_with_products_by_search?.shippers ? (
          <div className={cls.emptyBox}>
            <img src="/gif/searchEmpty.gif" alt="search" />
            <h3>{t("no_results")}</h3>
            <p>{t("instead, try looking elsewhere")}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

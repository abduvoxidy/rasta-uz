import cls from "./Products.module.scss";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

export default function Products({ title, products }) {
  const { t, lang } = useTranslation("common");

  return (
    <div className={cls.list}>
      <p className={cls.title}>{title}</p>
      <div className={cls.slider}>
        {products?.map((item) => (
          <div key={item.id} className={cls.item}>
            <Link
              key={item.id}
              href={`/restaurant/${item.shipper_id}?product_id=${item.id}`}
            >
              <a>
                <div className={cls.card}>
                  <div className={cls.img}>
                    <Image src={item.image} objectFit="cover" layout="fill" />
                  </div>
                  <div className={cls.body}>
                    <p>{item.name && item.name[lang]}</p>
                    <p>{item.menu_name && item.menu_name[lang]}</p>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

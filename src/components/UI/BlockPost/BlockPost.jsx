import cls from "./BlockPost.module.scss";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { format } from "date-fns";
import { getMonthFunction } from "utils/getMonth";

export function BlockPostComponent({ banner }) {
  const { lang } = useTranslation("common");
  const date = new Date(banner.created_at);
  const day = date.getDate();
  const month = getMonthFunction(date.getMonth() + 1);
  const time = format(new Date(banner?.created_at), "HH:mm");

  return (
    <div className={cls.root}>
      <p className={cls.date}>{`${day}-${month} ${time}`} </p>
      <div
        className={cls.mainTitle}
        dangerouslySetInnerHTML={{ __html: banner?.title[lang] }}
      />
      <div className={cls.image}>
        <Image
          src={banner?.image}
          width={1200}
          height={600}
          objectFit="cover"
        />
      </div>
      <div
        className={cls.description}
        dangerouslySetInnerHTML={{ __html: banner?.description[lang] }}
      />
    </div>
  );
}

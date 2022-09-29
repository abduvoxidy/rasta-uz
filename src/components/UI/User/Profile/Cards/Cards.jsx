import cls from "./Cards.module.scss";
import useTranslation from "next-translate/useTranslation";
import { Container } from "@mui/material";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import GreenButton from "components/UI/Buttons/GreenButton";
import { DeleteIcon, PaymentCardIcon } from "components/UI/Icons";
import { useGetUser } from "hooks/useGetUser";
import { usePaymentCard } from "services/paymentCard";
import AddCard from "./AddCard";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteCardConfirmModal from "./DeleteCardConfirmModal";
import EmptyBox from "components/UI/EmptyBox/EmptyBox";

export default function Cards() {
  const user = useGetUser();
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState();
  const { cards, deletCardMutation } = usePaymentCard({
    cardParams: {
      limit: 100,
      page: 1,
      user_id: user?.id,
    },
    deleteCardMutationProps: {
      onSuccess: () => {
        cards.refetch();
        setCardId(null);
        toast.success(t("card_deleted_successfully"));
      },
    },
  });

  const deleteCard = (id) => {
    deletCardMutation.mutate({
      card_id: id,
    });
  };

  return (
    <>
      <main className={cls.cards}>
        <Container>
          <h1>{t("my_cards")}</h1>
          <div className={cls.box}>
            <div className={cls.leftSide}>
              <LeftSidebar />
            </div>
            <div className={cls.rightBox}>
              {cards.isFetched &&
                (cards?.data?.cards.length > 0 ? (
                  <div className={cls.list}>
                    <h3>{t("my_cards")}</h3>

                    {cards?.data?.cards?.map((item) => (
                      <div id={item.card_id} className={cls.item}>
                        <div className={cls.leftItem}>
                          <PaymentCardIcon />
                          <div className={cls.cardInfo}>
                            <span>
                              •••• •••• •••• {item.card_num.substring(12, 16)}
                            </span>
                            <span>{item.card_expire_date}</span>
                          </div>
                        </div>
                        <div
                          className={cls.rightItem}
                          onClick={() => {
                            setCardId(item.card_id);
                          }}
                        >
                          <DeleteIcon />
                        </div>
                      </div>
                    ))}
                    <div className={cls.addCard} onClick={() => setOpen(true)}>
                      <GreenButton
                        fullWidth
                        className={cls.addBtn}
                        size="medium"
                      >
                        {t("add_new_card")}
                      </GreenButton>
                    </div>
                  </div>
                ) : (
                  <EmptyBox
                    imgSrc="/gif/emptyPaymentCard.gif"
                    imgAlt="empty card"
                    addText={t("add_card")}
                    title={t("you have not added card")}
                    subTitle={t(
                      "add card and all saved maps will be displayed here"
                    )}
                    fn={() => setOpen(true)}
                  />
                ))}
            </div>
          </div>
        </Container>
      </main>
      <AddCard setOpen={setOpen} open={open} refetch={cards.refetch} />
      <DeleteCardConfirmModal
        confrimFn={() => deleteCard(cardId)}
        open={cardId}
        handleClose={() => setCardId(null)}
      />
    </>
  );
}

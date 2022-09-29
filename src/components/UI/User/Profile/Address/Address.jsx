import cls from "./Address.module.scss";
import useTranslation from "next-translate/useTranslation";
import { Container } from "@mui/material";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import { DeleteIcon, EditIcon } from "components/UI/Icons";
import GreenButton from "components/UI/Buttons/GreenButton";
import { useAddress } from "services";
import { useGetUser } from "hooks/useGetUser";
import NewAddressModal from "components/UI/Address/NewAddressModal";
import { useState } from "react";
import AddressDeleteModal from "./AddressDeleteModal";
import { saveUserAddress } from "utils/userDetails";
import EmptyBox from "components/UI/EmptyBox/EmptyBox";

export default function Address() {
  const user = useGetUser();
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("common");

  const { addresses, deleteMutation } = useAddress({
    customerId: user?.id,
    deleteAddressMutationProps: {
      onSuccess: () => {
        if (user?.address?.id === open) {
          saveUserAddress(null);
          location.reload();
          return;
        }
        addresses.refetch();
        setOpen(false);
      },
    },
  });

  return (
    <>
      <main className={cls.address}>
        <Container>
          <h1>{t("my_address")}</h1>
          <div className={cls.box}>
            <div className={cls.leftSide}>
              <LeftSidebar />
            </div>
            <div className={cls.rightBox}>
              {addresses.isFetched &&
                (addresses?.data?.customer_addresses.length > 0 ? (
                  <div className={cls.list}>
                    {addresses?.data?.customer_addresses?.map((item) => (
                      <div className={cls.item} key={item.id}>
                        <div className={cls.leftItem}>
                          <span>{item.name || item.address}</span>
                          <span>{item.address}</span>
                        </div>
                        <div className={cls.rightItem}>
                          <EditIcon
                            onClick={() => {
                              setAddress(item);
                              setAddNewAddress(true);
                              setIsEditAddress(true);
                            }}
                          />
                          <span
                            onClick={() => {
                              setOpen(item.id);
                            }}
                          >
                            <DeleteIcon />
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className={cls.button}>
                      <GreenButton
                        size="medium"
                        onClick={() => {
                          setAddNewAddress(true);
                          setIsEditAddress(false);
                        }}
                      >
                        {t("add_new_address")}
                      </GreenButton>
                    </div>
                  </div>
                ) : (
                  <EmptyBox
                    imgSrc="/gif/emptyAddress.gif"
                    imgAlt="address empty"
                    addText={t("add_address")}
                    title={t("you do not have added addresses")}
                    subTitle={t("add an address and all saved addresses")}
                    fn={() => setAddNewAddress(true)}
                  />
                ))}
            </div>
          </div>
        </Container>
      </main>

      <NewAddressModal
        addNewAddress={addNewAddress}
        setAddNewAddress={setAddNewAddress}
        isEditAddress={isEditAddress}
        setIsEditAddress={setIsEditAddress}
        initialValue={address}
        setInitialValue={setAddress}
        refetch={addresses.refetch}
      />
      <AddressDeleteModal
        setOpen={setOpen}
        open={open}
        deleteAddress={deleteMutation}
      />
    </>
  );
}

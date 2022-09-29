import { Dialog } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import GreenButton from "../Buttons/GreenButton";
import GreyButton from "../Buttons/GreyButton";
import AddressPopopver from "./AddressPopopver";
import {
  CheckboxIcon,
  CloseIcon,
  LocationIcon,
  RightArrowIcon,
} from "../Icons";
import useTranslation from "next-translate/useTranslation";
import cls from "./AddAddress.module.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useGetUser } from "hooks/useGetUser";
import { useAddress } from "services";
import { saveUserAddress } from "utils/userDetails";
import { useDistance } from "hooks/useDistance";
import { useRouter } from "next/router";
import NewAddressModal from "./NewAddressModal";
import { useDispatch } from "react-redux";
import UnavailableDelivery from "../UnavailableDelivery/UnavailableDelivery";
import { clear } from "store/cart/cartSlice";
import usePrevious from "hooks/usePrevious";
import { setUnavailableDelivery } from "store/common/commonSlice";
import { useStyles } from "./styles";

export default function AddAddress() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [isAnotherAddress, setIsAnotherAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const classes = useStyles();
  const ref = useRef();
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const user = useGetUser();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const distance = useDistance();
  const dispatch = useDispatch();
  const isHideAddressRoutes = ["/checkout", "/restaurant/[id]", "/cart/[id]"];
  const isFirstEntry =
    typeof window !== "undefined" && sessionStorage.getItem("isFirstEntry");
  const { addresses } = useAddress({
    customerId: user?.id,
  });

  const [currentAddress, setCurrentAddress] = useState(null);
  const prevCurrentAddress = usePrevious(currentAddress);

  useEffect(() => {
    if (user && user.address) {
      setCurrentAddress(user.address);
    }
  }, [user]);

  useEffect(() => {
    if (
      user &&
      !user.address &&
      addresses?.data?.customer_addresses?.length === 0 &&
      !addNewAddress
    ) {
      setAddNewAddress(true);
    }
  }, [user, addresses.data]);

  useEffect(() => {
    if (
      distance &&
      ref.current &&
      router.pathname === "/" &&
      isFirstEntry !== "true"
    ) {
      ref.current.click();
      setIsAnotherAddress(distance);
    }
  }, [distance, isFirstEntry]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openAddAddress = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setAddNewAddress(true);
    setAnchorEl(null);
  };

  const addAddress = (event) => {
    if (addresses?.data?.customer_addresses?.length === 0) {
      setAnchorEl(event?.currentTarget);
      return;
    }

    if (isHideAddressRoutes.includes(router.pathname)) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    if (distance && isFirstEntry !== "true") {
      sessionStorage.setItem("isFirstEntry", true);
      setAnchorEl(event?.currentTarget);
      return;
    }

    if (!distance) {
      setEditAddress(true);
      return;
    }

    if (isFirstEntry && addresses?.data?.customer_addresses?.length > 0) {
      setEditAddress(true);
      return;
    }
  };

  const closeModal = () => {
    setEditAddress(false);
  };

  const changeAddress = (value) => {
    setEditAddress(false);
    if (prevCurrentAddress.id !== value.id && user.address.id !== value.id) {
      saveUserAddress(value);
      dispatch(clear());
      dispatch(setUnavailableDelivery(false));
      window.location.reload();
    }
  };

  return (
    <>
      <div className={cls.wrapperAddress}>
        <GreyButton
          buttonRef={ref}
          size="medium"
          icon={<LocationIcon />}
          onClick={addAddress}
          className={cls.addressName}
        >
          <span>
            {user && user.address
              ? user.address.name || user.address.address
              : t("enter a delivery address")}
          </span>
        </GreyButton>
        {user && user.address && (
          <div onClick={addAddress} className={cls.arrowIcon}>
            <RightArrowIcon />
          </div>
        )}
      </div>
      <AddressPopopver
        id={id}
        user={user}
        open={open}
        isAnotherAddress={isAnotherAddress}
        openAddAddress={openAddAddress}
        handleClose={handleClose}
        anchorEl={anchorEl}
        setEditAddress={setEditAddress}
      />

      <NewAddressModal
        setAddNewAddress={setAddNewAddress}
        addNewAddress={addNewAddress}
        isRequired={
          user &&
          !user.address &&
          addresses?.data?.customer_addresses?.length === 0
        }
      />
      <Dialog
        className={classes.root}
        open={editAddress}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <PerfectScrollbar className={cls.scrollBar}>
          <div className={cls.dialog}>
            <div className={cls.close} onClick={closeModal}>
              <CloseIcon />
            </div>
            <p>{t("where")}</p>
            <div className={cls.editAddress}>
              <div className={cls.list}>
                {addresses?.data?.customer_addresses?.map((item) => (
                  <div
                    className={cls.addressItem}
                    key={item.id}
                    onClick={() => changeAddress(item)}
                  >
                    <div className={cls.leftInfo}>
                      <p>{item.name}</p>
                      <p>{item.address}</p>
                    </div>
                    {currentAddress && currentAddress.id === item.id ? (
                      <CheckboxIcon />
                    ) : (
                      <div className={cls.checkbox} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PerfectScrollbar>
        <div className={cls.buttonsGropup}>
          <GreenButton
            fullWidth
            size="large"
            onClick={() => {
              setAddNewAddress(true);
              setEditAddress(false);
            }}
          >
            {t("add new address")}
          </GreenButton>
        </div>
      </Dialog>
      <UnavailableDelivery setEditAddress={setEditAddress} />
    </>
  );
}

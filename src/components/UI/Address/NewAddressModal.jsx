import cls from "./NewAddressModal.module.scss";
import { Dialog } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useForm } from "react-hook-form";
import { useAddress } from "services";
import { saveUserAddress } from "utils/userDetails";
import PerfectScrollbar from "react-perfect-scrollbar";
import Input from "../Forms/Input";
import GreyButton from "../Buttons/GreyButton";
import GreenButton from "../Buttons/GreenButton";
import { CloseIcon, SearchIcon } from "../Icons";
import YandexMap from "../YandexMap/YandexMap";
import { rem } from "utils/pxToRem";
import { useGetUser } from "hooks/useGetUser";
import { useDispatch } from "react-redux";
import { clear } from "store/cart/cartSlice";
import { useStyles } from "./styles";
import { useWindowWidth } from "hooks/useWindowWidth";
import { searchAddress } from "utils/yandexMapUtils";
import useDebounce from "hooks/useDebounce";
import useOnClickOutside from "hooks/useOnClickOutside";
import useGeolocation from "hooks/useGeolocation";

export default function NewAddressModal({
  addNewAddress,
  setAddNewAddress,
  isEditAddress,
  setIsEditAddress = () => {},
  initialValue,
  refetch,
  isRequired,
}) {
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
    setError,
  } = useForm();
  const [mapInfo, setMapInfo] = useState("");
  const [isClear, setIsClear] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const ref = useRef();
  const user = useGetUser();
  const debouncedSearchTerm = useDebounce(mapInfo, 500);
  const classes = useStyles();
  const [location, setLocation] = useState({
    lat: 41.311144,
    long: 69.279728,
    zoom: 15,
  });
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const geoLocation = useGeolocation();
  const { t } = useTranslation("common");

  useEffect(() => {
    setLocation((prev) => ({
      ...prev,
      ...geoLocation,
    }));
  }, [geoLocation]);

  // useEffect(() => {
  //   setValue('address', mapInfo)
  //   setOpen(true)
  // }, [mapInfo])

  useOnClickOutside(ref, () => setOpen(false));

  useEffect(async () => {
    // console.log('debouncedSearchTerm', debouncedSearchTerm)
    if (debouncedSearchTerm) {
      const results = await searchAddress({ geocode: debouncedSearchTerm });
      if (results) {
        setAddresses(results);
      }
    } else {
      setAddresses([]);
    }
  }, [debouncedSearchTerm]);

  const { createAddressMutation, deleteMutation } = useAddress({
    createAddressMutationProps: {
      onSuccess: (res) => {
        if (res.id) {
          if (initialValue && initialValue.id) {
            refetch();
            setAddNewAddress(false);
            return;
          }
          const locationPlace = { ...location };
          delete locationPlace.zoom;
          saveUserAddress({
            ...getValues(),
            location: locationPlace,
            id: res.id,
            address: mapInfo,
          });
          dispatch(clear());
          setAddNewAddress(false);
          window.location.reload();
        }
      },
      onError: (e) => {
        setError("name", { message: t("registered_address") });
      },
    },
    deleteAddressMutationProps: {
      onSuccess: () => {
        const locationPlace = { ...location };
        delete locationPlace.zoom;
        createAddressMutation.mutate({
          ...getValues(),
          location: locationPlace,
          customer_id: user.id,
          name: getValues("name") || getValues("address"),
          address: mapInfo,
        });
      },
    },
  });

  useEffect(() => {
    if (initialValue && initialValue.id) {
      setMapInfo(initialValue.address);
      // setValue('address', initialValue.address)
      setValue("floor", initialValue.floor);
      setValue("apartment", initialValue.apartment);
      setValue("building", initialValue.building);
      setValue("name", initialValue.name);
      setLocation((prev) => ({
        ...prev,
        lat: initialValue.location.lat,
        long: initialValue.location.long,
      }));
    }
  }, [initialValue]);

  const onSubmit = (data) => {
    const locationPlace = { ...location };
    delete locationPlace.zoom;
    if (initialValue && initialValue.id) {
      deleteMutation.mutate(initialValue.id);
    } else {
      createAddressMutation.mutate({
        ...data,
        location: locationPlace,
        customer_id: user.id,
        name: data.name || data.address,
        address: mapInfo,
        name: data.name || mapInfo,
      });
    }
  };

  const searchConfirm = (item) => {
    window.ymaps.geocode(item?.GeoObject?.name).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);
      setConfirm(true);
      setIsClear(false);
      setMapInfo(firstGeoObject.properties._data.name);
      setLocation((prev) => ({
        ...prev,
        lat: firstGeoObject.geometry._coordinates[0],
        long: firstGeoObject.geometry._coordinates[1],
        zoom: 18,
      }));
      setOpen(false);
    });
  };

  return (
    <Dialog
      className={classes.root}
      open={addNewAddress}
      onClose={() => {
        setIsEditAddress(false);
        if (!isRequired) setAddNewAddress(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className={`${cls.addressForm} scrollBar`}>
        <div className={cls.dialogNewAddress}>
          {!isRequired && (
            <div className={cls.close} onClick={() => setAddNewAddress(false)}>
              <CloseIcon />
            </div>
          )}
          {isEditAddress ? (
            <p>{t("change_address")}</p>
          ) : (
            <p>{t("enter a delivery address")}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={cls.form}>
              <div className={cls.searchForm} ref={ref}>
                <Input
                  placeholder={t("start_search")}
                  startAdornment={<SearchIcon />}
                  className={cls.search}
                  onChange={(e) => {
                    setMapInfo(e.target.value);
                    setOpen(true);
                  }}
                  name="address"
                  disabled={isConfirm}
                  clearFn={() => {
                    setIsClear(true);
                    setConfirm(false);
                    setMapInfo("");
                  }}
                  value={mapInfo}
                  required
                  isClear={isConfirm}
                />

                {open && addresses && addresses.length > 0 && (
                  <div className={`${cls.addressListPopover} scrollBar`}>
                    {addresses.map((item, index) => (
                      <div
                        key={index + "address"}
                        className={cls.addressItem}
                        onClick={() => searchConfirm(item)}
                      >
                        <div className={cls.addressText}>
                          <p>{item?.GeoObject?.name}</p>
                          <p>{item?.GeoObject?.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={cls.addressName}>
                <Input
                  placeholder={t("address_name")}
                  register={register}
                  errors={errors}
                  name="name"
                />
              </div>
              <div className={cls.addressOptions}>
                <Input
                  className={cls.numberInput}
                  placeholder={t("sq-office")}
                  register={register}
                  name="apartment"
                />
                <Input
                  placeholder={t("entrance")}
                  register={register}
                  name="building"
                />
                <Input
                  className={cls.numberInput}
                  placeholder={t("floor")}
                  register={register}
                  name="floor"
                />
              </div>
              <div className={cls.map}>
                {addNewAddress && (
                  <YandexMap
                    setLocation={setLocation}
                    location={location}
                    height={windowWidth > 768 ? rem(250) : rem(210)}
                    setMapInfo={setMapInfo}
                    mapInfo={mapInfo}
                    setConfirm={setConfirm}
                    isConfirm={isConfirm}
                    setIsClear={setIsClear}
                    isClear={isClear}
                  />
                )}
              </div>
              <div className={cls.buttons}>
                <GreyButton
                  fullWidth
                  disabled={isRequired}
                  size="small"
                  onClick={() => setAddNewAddress(false)}
                >
                  {t("cancel")}
                </GreyButton>
                <GreenButton
                  loading={createAddressMutation.isLoading}
                  fullWidth
                  type="submit"
                  disabled={!isConfirm}
                >
                  {isEditAddress ? t("save") : t("confirm")}
                </GreenButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

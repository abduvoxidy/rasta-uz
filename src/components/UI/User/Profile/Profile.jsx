import { CircularProgress, Container } from "@mui/material";
import GreenButton from "components/UI/Buttons/GreenButton";
import useTranslation from "next-translate/useTranslation";
import Input from "components/UI/Forms/Input";
import Select from "components/UI/Forms/Select";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import cls from "./Profile.module.scss";
import { useGetUser } from "hooks/useGetUser";
import { useAuth } from "services";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import DatePicker from "components/UI/Forms/DatePicker";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { request } from "services/http-client";
import { CloseIcon, CalendarDateIcon } from "components/UI/Icons";

export default function Profile() {
  const { t } = useTranslation("common");
  const user = useGetUser();
  const { handleSubmit, register, setValue, getValues, watch } = useForm();
  const hiddenFileInput = useRef(null);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const { customer, updateMutation } = useAuth({
    customerParams: {
      id: user?.id,
    },
    updateMutationProps: {
      onSuccess: () => {
        toast.success("succesfully");
      },
    },
  });

  const handleChange = (newValue) => {
    setSelectedDate(newValue);
  };

  useEffect(() => {
    if (customer.data && customer.data.id) {
      setValue("name", customer.data.name);
      setValue("phone", customer.data.phone);
      setValue("image", customer.data.image);
      setSelectedDate(
        customer.data.date_of_birth ? new Date(customer.data.date_of_birth) : ""
      );
    }
  }, [customer.data]);

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      image: data.image
        ? `/${data.image.replace(process.env.NEXT_PUBLIC_MINIO_BASE_URL, "")}`
        : "",
      date_of_birth: selectedDate
        ? format(new Date(selectedDate), "yyyy-MM-dd")
        : undefined,
      id: customer.data.id,
    });
  };

  const uploadImg = (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    hiddenFileInput.current.value = "";
    setLoader(true);
    request
      .post("upload", formData, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })
      .then((res) => {
        setValue(
          "image",
          process.env.NEXT_PUBLIC_MINIO_BASE_URL + res.filename
        );
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <main className={cls.profile}>
      <Container>
        <h1>{t("profile")}</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={cls.box}>
            <div className={cls.leftSide}>
              <LeftSidebar />
            </div>
            <div className={cls.form}>
              <div className={cls.imgBox}>
                <div className={cls.img}>
                  {watch("image") && !loader && (
                    <div
                      className={cls.close}
                      onClick={() => setValue("image", "")}
                    >
                      <CloseIcon />
                    </div>
                  )}

                  {loader && (
                    <div className={cls.loader}>
                      <CircularProgress size={30} />
                    </div>
                  )}

                  <img
                    src={watch("image") ? watch("image") : "/images/user.png"}
                    alt="profile"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={hiddenFileInput}
                    onChange={uploadImg}
                    style={{ display: "none" }}
                  />
                </div>
                <span className={cls.changeImg} onClick={handleClick}>
                  {watch("image") ? t("change_photo") : t("add_photo")}
                </span>
              </div>
              <div className={cls.innerBox}>
                <div className={cls.inputs}>
                  <div className={cls.inputBox}>
                    <label>{t("fullName")}</label>
                    <Input register={register} name="name" />
                  </div>
                  <div className={cls.inputBox}>
                    <label>{t("phone_number")}</label>
                    <Input register={register} name="phone" disabled />
                  </div>
                  <div className={cls.inputBox}>
                    <label>{t("birthday")}</label>
                    <div className={cls.dateBirth}>
                      <DatePicker
                        selectedDate={selectedDate}
                        open={open}
                        setOpen={setOpen}
                        handleChange={handleChange}
                      />
                      <div
                        onClick={() => setOpen(true)}
                        className={cls.calendar}
                      >
                        <CalendarDateIcon />
                      </div>
                    </div>
                  </div>
                  {/* <div className={cls.inputBox}>
                    <label>Язык</label>
                    <Select emoji={'👍'} type='date' />
                  </div> */}
                </div>
                <div className={cls.button}>
                  <GreenButton
                    type="submit"
                    loading={updateMutation.isLoading}
                    size="medium"
                  >
                    {t("save_changes")}
                  </GreenButton>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import { RegPhase2Res, SelectPhase } from "../../../../Interface/Registration";
import {
  CustomButtonBG,
  CustomMiniBTN,
} from "../../../MainBlock/Button/CustomButton";
import { CustomInput } from "../../../MainBlock/Input/CustomInput";
import * as yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { useDispatch } from "react-redux";
import styles from "./RegPhaseTwo.module.scss";
import { useTypedSelector } from "../../../../Hooks/useTypedSelector";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslation } from "react-i18next";

export const RegPhaseTwo = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useDispatch();
  const reg = useTypedSelector((state) => state.reg);
  const [t] = useTranslation("translation");

  const [bot, setBot] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<any>();
  const [visible, setVisoiblity] = useState(false);
  const [visible2, setVisoiblity2] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>();
  const [typingTimeout2, setTypingTimeout2] = useState<any>();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  };

  useEffect(() => {
    document.title = "Sign Up | Phase Two - Flip";
    document.title = t("auht.signup.reg_p2.title_page");
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (reg.succses) {
      const data = reg.data;
      data!.UserImage = selectedFile;

      axios
        .post("account/registration", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.status === 200)
            dispatch({
              type: "REG-PHASE",
              payload: {
                phase: SelectPhase.confrim,
              },
            });
          else {
            errors.Email = t("auht.signup.reg_p2.yup.error").toString();
            errors.UserName = t("auht.signup.reg_p2.yup.error").toString();
          }
        })
        .catch(() => {
          alert(
            "Ошибка в реєстрації! Можливо ошибка в неправильних введених данних!"
          );
        });
    }
  }, [reg]);

  const initialValues: RegPhase2Res = {
    UserImage: null as any,
    UserName: reg.data?.UserName || "",
    Email: reg.data?.Email || "",
    Password: "",
    ConfirmPassword: "",
  };

  const loginMatches = /^[a-zA-Z0-9-._!]{5,15}$/;

  const Reg2Schema = yup.object({
    UserName: yup
      .string()
      .min(5, t("auht.signup.reg_p2.yup.username.min").toString())
      .max(15, t("auht.signup.reg_p2.yup.username.max").toString())
      .matches(
        loginMatches,
        t("auht.signup.reg_p2.yup.username.mat").toString()
      )
      .test(
        "check-login",
        t("auht.signup.reg_p2.yup.username.exist").toString(),
        async (value) => {
          if (typingTimeout) clearTimeout(typingTimeout);
          return new Promise((resolve) => {
            setTypingTimeout(
              setTimeout(async () => {
                await axios.get(`account/check-login/${value}`).then((res) => {
                  if (res.status == 200) return resolve(true);
                  else return resolve(false);
                });
              }, 500)
            );
          });
        }
      )
      .required(t("auht.signup.reg_p2.yup.username.req").toString()),
    Email: yup
      .string()
      .email(t("auht.signup.reg_p2.yup.email.mat").toString())
      .test(
        "check-email",
        t("auht.signup.reg_p2.yup.email.exist").toString(),
        async (value) => {
          if (typingTimeout) clearTimeout(typingTimeout);
          return new Promise((resolve) => {
            setTypingTimeout(
              setTimeout(async () => {
                await axios.get(`account/check-email/${value}`).then((res) => {
                  if (res.status == 200) return resolve(true);
                  else return resolve(false);
                });
              }, 500)
            );
          });
        }
      )
      .required(t("auht.signup.reg_p2.yup.email.req").toString()),
    Password: yup
      .string()
      .min(8, t("auht.signup.reg_p2.yup.password.min").toString())
      .max(20, t("auht.signup.reg_p2.yup.password.max").toString())
      .oneOf(
        [yup.ref("ConfirmPassword"), null],
        t("auht.signup.reg_p2.yup.password.one").toString()
      )
      .required(t("auht.signup.reg_p2.yup.password.req").toString()),
    ConfirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("Password"), null],
        t("auht.signup.reg_p2.yup.confirm_pass.one").toString()
      )
      .required(t("auht.signup.reg_p2.yup.confirm_pass.req").toString()),
  });

  const PhaseTwo = async (value: RegPhase2Res) => {
    if (!executeRecaptcha) {
      setBot(true);
      return;
    }

    if (bot) return;

    await dispatch({
      type: "REG",
      payload: {
        data: {
          UserName: value.UserName,
          Email: value.Email,
          Password: value.Password,
          RecaptchaToken: await executeRecaptcha(),
        },
        succses: true,
      },
    });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Reg2Schema,
    onSubmit: PhaseTwo,
  });

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    isValid,
    dirty,
  } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form className={`${styles.form} dflex-column`} onSubmit={handleSubmit}>
          <div className={styles.form_request}>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={(event: any) => {
                const file = event.currentTarget.files[0];
                setFieldValue("UserImage", file);
                setSelectedFile(file);
              }}
              style={{ display: "none" }}
              accept=".jpg, .jpeg"
              name="UserImage"
            />
            {selectedFile ? (
              <div className={styles.upload} onClick={handleClick}>
                <div className={styles.upload_text}>
                  {t("auht.signup.reg_p2.file")}
                </div>

                <svg
                  width="445"
                  height="298"
                  viewBox="0 0 445 298"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.upload_svg}
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15 0C6.71573 0 0 6.71573 0 15V283C0 291.284 6.71573 298 15 298H430C438.284 298 445 291.284 445 283V15C445 6.71573 438.284 0 430 0H15ZM222.5 280.089C294.898 280.089 353.589 221.398 353.589 149C353.589 76.6017 294.898 17.9113 222.5 17.9113C150.102 17.9113 91.4111 76.6017 91.4111 149C91.4111 221.398 150.102 280.089 222.5 280.089Z"
                    fill="#6A6A6A"
                    fill-opacity="0.5"
                  />
                  <path
                    d="M114.787 65.9882C124.235 47.8997 149.208 24.3923 184.314 17.8799"
                    stroke="white"
                  />
                  <path
                    d="M337.031 219.81C329.31 238.7 306.638 264.433 272.292 274.19"
                    stroke="white"
                  />
                </svg>

                <img
                  alt=""
                  width="445"
                  height="298"
                  className={styles.upload_img}
                  src={preview}
                />
              </div>
            ) : (
              <svg
                width="479"
                height="332"
                viewBox="0 0 479 332"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
                onClick={handleClick}
              >
                <g filter="url(#filter0_d_785_3803)">
                  <rect
                    x="17"
                    y="16"
                    width="445"
                    height="298"
                    rx="15"
                    fill="white"
                  />
                </g>
                <path
                  d="M42.1364 48.3515C41.3864 48.3515 40.7178 48.2227 40.1307 47.9651C39.5473 47.7075 39.0833 47.3496 38.7386 46.8912C38.3977 46.4291 38.2121 45.8931 38.1818 45.2833H39.6136C39.6439 45.6583 39.7727 45.9822 40 46.2549C40.2273 46.5238 40.5246 46.7322 40.892 46.8799C41.2595 47.0276 41.6667 47.1015 42.1136 47.1015C42.6136 47.1015 43.0568 47.0144 43.4432 46.8401C43.8295 46.6659 44.1326 46.4234 44.3523 46.1128C44.572 45.8022 44.6818 45.4424 44.6818 45.0333C44.6818 44.6053 44.5758 44.2284 44.3636 43.9026C44.1515 43.5731 43.8409 43.3155 43.4318 43.1299C43.0227 42.9443 42.5227 42.8515 41.9318 42.8515H41V41.6015H41.9318C42.3939 41.6015 42.7992 41.5181 43.1477 41.3515C43.5 41.1848 43.7746 40.95 43.9716 40.6469C44.1723 40.3439 44.2727 39.9878 44.2727 39.5787C44.2727 39.1848 44.1856 38.842 44.0114 38.5503C43.8371 38.2587 43.5909 38.0314 43.2727 37.8685C42.9583 37.7056 42.5871 37.6242 42.1591 37.6242C41.7576 37.6242 41.3788 37.6981 41.0227 37.8458C40.6705 37.9897 40.3826 38.2 40.1591 38.4765C39.9356 38.7492 39.8144 39.0787 39.7955 39.4651H38.4318C38.4545 38.8553 38.6383 38.3212 38.983 37.8628C39.3277 37.4007 39.7784 37.0409 40.3352 36.7833C40.8958 36.5257 41.5114 36.3969 42.1818 36.3969C42.9015 36.3969 43.5189 36.5428 44.0341 36.8344C44.5492 37.1223 44.9451 37.503 45.2216 37.9765C45.4981 38.45 45.6364 38.9613 45.6364 39.5106C45.6364 40.1659 45.464 40.7246 45.1193 41.1867C44.7784 41.6488 44.3144 41.9689 43.7273 42.1469V42.2378C44.4621 42.359 45.036 42.6715 45.4489 43.1753C45.8617 43.6753 46.0682 44.2947 46.0682 45.0333C46.0682 45.6659 45.8958 46.234 45.5511 46.7378C45.2102 47.2378 44.7443 47.6318 44.1534 47.9197C43.5625 48.2075 42.8902 48.3515 42.1364 48.3515ZM50.983 48.3969C50.4299 48.3969 49.928 48.2928 49.4773 48.0844C49.0265 47.8723 48.6686 47.5674 48.4034 47.1697C48.1383 46.7681 48.0057 46.2833 48.0057 45.7151C48.0057 45.2151 48.1042 44.8098 48.3011 44.4992C48.4981 44.1848 48.7614 43.9386 49.0909 43.7606C49.4205 43.5825 49.7841 43.45 50.1818 43.3628C50.5833 43.2719 50.9867 43.2 51.392 43.1469C51.9223 43.0787 52.3523 43.0276 52.6818 42.9935C53.0152 42.9556 53.2576 42.8931 53.4091 42.806C53.5644 42.7189 53.642 42.5674 53.642 42.3515V42.306C53.642 41.7454 53.4886 41.3098 53.1818 40.9992C52.8788 40.6886 52.4186 40.5333 51.8011 40.5333C51.161 40.5333 50.6591 40.6734 50.2955 40.9537C49.9318 41.234 49.6761 41.5333 49.5284 41.8515L48.2557 41.3969C48.483 40.8666 48.786 40.4537 49.1648 40.1583C49.5473 39.859 49.964 39.6507 50.4148 39.5333C50.8693 39.4121 51.3163 39.3515 51.7557 39.3515C52.036 39.3515 52.358 39.3856 52.7216 39.4537C53.089 39.5181 53.4432 39.6526 53.7841 39.8572C54.1288 40.0617 54.4148 40.3704 54.642 40.7833C54.8693 41.1962 54.983 41.7492 54.983 42.4424V48.1924H53.642V47.0106H53.5739C53.483 47.2 53.3314 47.4026 53.1193 47.6185C52.9072 47.8344 52.625 48.0181 52.2727 48.1697C51.9205 48.3212 51.4905 48.3969 50.983 48.3969ZM51.1875 47.1924C51.7178 47.1924 52.1648 47.0882 52.5284 46.8799C52.8958 46.6715 53.1723 46.4026 53.358 46.0731C53.5473 45.7435 53.642 45.3969 53.642 45.0333V43.806C53.5852 43.8742 53.4602 43.9367 53.267 43.9935C53.0777 44.0465 52.858 44.0939 52.608 44.1356C52.3617 44.1734 52.1212 44.2075 51.8864 44.2378C51.6553 44.2644 51.4678 44.2871 51.3239 44.306C50.9754 44.3515 50.6496 44.4253 50.3466 44.5276C50.0473 44.6261 49.8049 44.7757 49.6193 44.9765C49.4375 45.1734 49.3466 45.4424 49.3466 45.7833C49.3466 46.2492 49.5189 46.6015 49.8636 46.8401C50.2121 47.075 50.6534 47.1924 51.1875 47.1924ZM57.4304 48.1924V39.4651H60.9986C61.938 39.4651 62.6842 39.6772 63.2372 40.1015C63.7902 40.5257 64.0668 41.0863 64.0668 41.7833C64.0668 42.3136 63.9096 42.7246 63.5952 43.0162C63.2808 43.3041 62.8774 43.4992 62.3849 43.6015C62.7069 43.6469 63.0194 43.7606 63.3224 43.9424C63.6293 44.1242 63.883 44.3742 64.0838 44.6924C64.2846 45.0068 64.3849 45.3931 64.3849 45.8515C64.3849 46.2984 64.2713 46.6981 64.044 47.0503C63.8168 47.4026 63.491 47.681 63.0668 47.8856C62.6425 48.0901 62.1349 48.1924 61.544 48.1924H57.4304ZM58.7031 46.9651H61.544C62.0062 46.9651 62.3679 46.8553 62.6293 46.6356C62.8906 46.4159 63.0213 46.1166 63.0213 45.7378C63.0213 45.2871 62.8906 44.9329 62.6293 44.6753C62.3679 44.414 62.0062 44.2833 61.544 44.2833H58.7031V46.9651ZM58.7031 43.1242H60.9986C61.3584 43.1242 61.6671 43.075 61.9247 42.9765C62.1823 42.8742 62.3793 42.7303 62.5156 42.5447C62.6558 42.3553 62.7259 42.1318 62.7259 41.8742C62.7259 41.5068 62.5724 41.2189 62.2656 41.0106C61.9588 40.7984 61.5365 40.6924 60.9986 40.6924H58.7031V43.1242ZM68.983 48.3969C68.4299 48.3969 67.928 48.2928 67.4773 48.0844C67.0265 47.8723 66.6686 47.5674 66.4034 47.1697C66.1383 46.7681 66.0057 46.2833 66.0057 45.7151C66.0057 45.2151 66.1042 44.8098 66.3011 44.4992C66.4981 44.1848 66.7614 43.9386 67.0909 43.7606C67.4205 43.5825 67.7841 43.45 68.1818 43.3628C68.5833 43.2719 68.9867 43.2 69.392 43.1469C69.9223 43.0787 70.3523 43.0276 70.6818 42.9935C71.0152 42.9556 71.2576 42.8931 71.4091 42.806C71.5644 42.7189 71.642 42.5674 71.642 42.3515V42.306C71.642 41.7454 71.4886 41.3098 71.1818 40.9992C70.8788 40.6886 70.4186 40.5333 69.8011 40.5333C69.161 40.5333 68.6591 40.6734 68.2955 40.9537C67.9318 41.234 67.6761 41.5333 67.5284 41.8515L66.2557 41.3969C66.483 40.8666 66.786 40.4537 67.1648 40.1583C67.5473 39.859 67.964 39.6507 68.4148 39.5333C68.8693 39.4121 69.3163 39.3515 69.7557 39.3515C70.036 39.3515 70.358 39.3856 70.7216 39.4537C71.089 39.5181 71.4432 39.6526 71.7841 39.8572C72.1288 40.0617 72.4148 40.3704 72.642 40.7833C72.8693 41.1962 72.983 41.7492 72.983 42.4424V48.1924H71.642V47.0106H71.5739C71.483 47.2 71.3314 47.4026 71.1193 47.6185C70.9072 47.8344 70.625 48.0181 70.2727 48.1697C69.9205 48.3212 69.4905 48.3969 68.983 48.3969ZM69.1875 47.1924C69.7178 47.1924 70.1648 47.0882 70.5284 46.8799C70.8958 46.6715 71.1723 46.4026 71.358 46.0731C71.5473 45.7435 71.642 45.3969 71.642 45.0333V43.806C71.5852 43.8742 71.4602 43.9367 71.267 43.9935C71.0777 44.0465 70.858 44.0939 70.608 44.1356C70.3617 44.1734 70.1212 44.2075 69.8864 44.2378C69.6553 44.2644 69.4678 44.2871 69.3239 44.306C68.9754 44.3515 68.6496 44.4253 68.3466 44.5276C68.0473 44.6261 67.8049 44.7757 67.6193 44.9765C67.4375 45.1734 67.3466 45.4424 67.3466 45.7833C67.3466 46.2492 67.5189 46.6015 67.8636 46.8401C68.2121 47.075 68.6534 47.1924 69.1875 47.1924ZM81.2713 43.2151V44.4651H76.4531V43.2151H81.2713ZM76.7713 39.4651V48.1924H75.4304V39.4651H76.7713ZM82.294 39.4651V48.1924H80.9531V39.4651H82.294ZM83.5554 40.7151V39.4651H90.6463V40.7151H87.7827V48.1924H86.4418V40.7151H83.5554ZM94.7173 48.3969C94.1643 48.3969 93.6624 48.2928 93.2116 48.0844C92.7609 47.8723 92.4029 47.5674 92.1378 47.1697C91.8726 46.7681 91.7401 46.2833 91.7401 45.7151C91.7401 45.2151 91.8385 44.8098 92.0355 44.4992C92.2325 44.1848 92.4957 43.9386 92.8253 43.7606C93.1548 43.5825 93.5185 43.45 93.9162 43.3628C94.3177 43.2719 94.7211 43.2 95.1264 43.1469C95.6567 43.0787 96.0866 43.0276 96.4162 42.9935C96.7495 42.9556 96.992 42.8931 97.1435 42.806C97.2988 42.7189 97.3764 42.5674 97.3764 42.3515V42.306C97.3764 41.7454 97.223 41.3098 96.9162 40.9992C96.6132 40.6886 96.1529 40.5333 95.5355 40.5333C94.8954 40.5333 94.3935 40.6734 94.0298 40.9537C93.6662 41.234 93.4105 41.5333 93.2628 41.8515L91.9901 41.3969C92.2173 40.8666 92.5204 40.4537 92.8991 40.1583C93.2817 39.859 93.6984 39.6507 94.1491 39.5333C94.6037 39.4121 95.0507 39.3515 95.4901 39.3515C95.7704 39.3515 96.0923 39.3856 96.456 39.4537C96.8234 39.5181 97.1776 39.6526 97.5185 39.8572C97.8632 40.0617 98.1491 40.3704 98.3764 40.7833C98.6037 41.1962 98.7173 41.7492 98.7173 42.4424V48.1924H97.3764V47.0106H97.3082C97.2173 47.2 97.0658 47.4026 96.8537 47.6185C96.6416 47.8344 96.3594 48.0181 96.0071 48.1697C95.6548 48.3212 95.2249 48.3969 94.7173 48.3969ZM94.9219 47.1924C95.4522 47.1924 95.8991 47.0882 96.2628 46.8799C96.6302 46.6715 96.9067 46.4026 97.0923 46.0731C97.2817 45.7435 97.3764 45.3969 97.3764 45.0333V43.806C97.3196 43.8742 97.1946 43.9367 97.0014 43.9935C96.812 44.0465 96.5923 44.0939 96.3423 44.1356C96.0961 44.1734 95.8556 44.2075 95.6207 44.2378C95.3897 44.2644 95.2022 44.2871 95.0582 44.306C94.7098 44.3515 94.384 44.4253 94.081 44.5276C93.7817 44.6261 93.5393 44.7757 93.3537 44.9765C93.1719 45.1734 93.081 45.4424 93.081 45.7833C93.081 46.2492 93.2533 46.6015 93.598 46.8401C93.9465 47.075 94.3878 47.1924 94.9219 47.1924ZM100.619 48.1924L104.165 43.7606L100.665 39.4651H102.256L105.165 43.1924H105.892V39.4651H107.233V43.1924H107.938L110.847 39.4651H112.438L108.96 43.7606L112.483 48.1924H110.869L107.915 44.4424H107.233V48.1924H105.892V44.4424H105.21L102.233 48.1924H100.619ZM115.74 46.2151L119.945 39.4651H121.49V48.1924H120.149V41.4424L115.967 48.1924H114.399V39.4651H115.74V46.2151ZM122.759 40.7151V39.4651H129.849V40.7151H126.986V48.1924H125.645V40.7151H122.759ZM133.146 46.2151L137.351 39.4651H138.896V48.1924H137.555V41.4424L133.374 48.1924H131.805V39.4651H133.146V46.2151ZM149.398 51.1697V36.556H150.739V51.1697H149.398ZM149.398 48.3742C148.807 48.3742 148.269 48.2681 147.784 48.056C147.299 47.8401 146.883 47.5352 146.534 47.1412C146.186 46.7435 145.917 46.2681 145.727 45.7151C145.538 45.1621 145.443 44.5484 145.443 43.8742C145.443 43.1924 145.538 42.575 145.727 42.0219C145.917 41.4651 146.186 40.9878 146.534 40.5901C146.883 40.1924 147.299 39.8875 147.784 39.6753C148.269 39.4594 148.807 39.3515 149.398 39.3515H149.807V48.3742H149.398ZM149.398 47.1697H149.625V40.556H149.398C148.951 40.556 148.563 40.6469 148.233 40.8287C147.903 41.0068 147.631 41.2511 147.415 41.5617C147.203 41.8685 147.044 42.2208 146.938 42.6185C146.835 43.0162 146.784 43.4348 146.784 43.8742C146.784 44.4575 146.877 44.9992 147.062 45.4992C147.248 45.9992 147.534 46.4026 147.92 46.7094C148.307 47.0162 148.799 47.1697 149.398 47.1697ZM150.739 48.3742H150.33V39.3515H150.739C151.33 39.3515 151.867 39.4594 152.352 39.6753C152.837 39.8875 153.254 40.1924 153.602 40.5901C153.951 40.9878 154.22 41.4651 154.409 42.0219C154.598 42.575 154.693 43.1924 154.693 43.8742C154.693 44.5484 154.598 45.1621 154.409 45.7151C154.22 46.2681 153.951 46.7435 153.602 47.1412C153.254 47.5352 152.837 47.8401 152.352 48.056C151.867 48.2681 151.33 48.3742 150.739 48.3742ZM150.739 47.1697C151.189 47.1697 151.578 47.0825 151.903 46.9083C152.233 46.7303 152.504 46.4878 152.716 46.181C152.932 45.8704 153.091 45.5181 153.193 45.1242C153.299 44.7265 153.352 44.3098 153.352 43.8742C153.352 43.2909 153.259 42.7473 153.074 42.2435C152.888 41.7397 152.602 41.3325 152.216 41.0219C151.83 40.7113 151.337 40.556 150.739 40.556H150.511V47.1697H150.739ZM160.288 48.3742C159.5 48.3742 158.809 48.1867 158.214 47.8117C157.624 47.4367 157.161 46.9121 156.828 46.2378C156.499 45.5636 156.334 44.7757 156.334 43.8742C156.334 42.9651 156.499 42.1715 156.828 41.4935C157.161 40.8155 157.624 40.289 158.214 39.914C158.809 39.539 159.5 39.3515 160.288 39.3515C161.076 39.3515 161.766 39.539 162.357 39.914C162.951 40.289 163.413 40.8155 163.743 41.4935C164.076 42.1715 164.243 42.9651 164.243 43.8742C164.243 44.7757 164.076 45.5636 163.743 46.2378C163.413 46.9121 162.951 47.4367 162.357 47.8117C161.766 48.1867 161.076 48.3742 160.288 48.3742ZM160.288 47.1697C160.887 47.1697 161.379 47.0162 161.766 46.7094C162.152 46.4026 162.438 45.9992 162.624 45.4992C162.809 44.9992 162.902 44.4575 162.902 43.8742C162.902 43.2909 162.809 42.7473 162.624 42.2435C162.438 41.7397 162.152 41.3325 161.766 41.0219C161.379 40.7113 160.887 40.556 160.288 40.556C159.69 40.556 159.197 40.7113 158.811 41.0219C158.425 41.3325 158.139 41.7397 157.953 42.2435C157.768 42.7473 157.675 43.2909 157.675 43.8742C157.675 44.4575 157.768 44.9992 157.953 45.4992C158.139 45.9992 158.425 46.4026 158.811 46.7094C159.197 47.0162 159.69 47.1697 160.288 47.1697ZM165.149 40.7151V39.4651H172.24V40.7151H169.376V48.1924H168.036V40.7151H165.149ZM177.288 48.3742C176.5 48.3742 175.809 48.1867 175.214 47.8117C174.624 47.4367 174.161 46.9121 173.828 46.2378C173.499 45.5636 173.334 44.7757 173.334 43.8742C173.334 42.9651 173.499 42.1715 173.828 41.4935C174.161 40.8155 174.624 40.289 175.214 39.914C175.809 39.539 176.5 39.3515 177.288 39.3515C178.076 39.3515 178.766 39.539 179.357 39.914C179.951 40.289 180.413 40.8155 180.743 41.4935C181.076 42.1715 181.243 42.9651 181.243 43.8742C181.243 44.7757 181.076 45.5636 180.743 46.2378C180.413 46.9121 179.951 47.4367 179.357 47.8117C178.766 48.1867 178.076 48.3742 177.288 48.3742ZM177.288 47.1697C177.887 47.1697 178.379 47.0162 178.766 46.7094C179.152 46.4026 179.438 45.9992 179.624 45.4992C179.809 44.9992 179.902 44.4575 179.902 43.8742C179.902 43.2909 179.809 42.7473 179.624 42.2435C179.438 41.7397 179.152 41.3325 178.766 41.0219C178.379 40.7113 177.887 40.556 177.288 40.556C176.69 40.556 176.197 40.7113 175.811 41.0219C175.425 41.3325 175.139 41.7397 174.953 42.2435C174.768 42.7473 174.675 43.2909 174.675 43.8742C174.675 44.4575 174.768 44.9992 174.953 45.4992C175.139 45.9992 175.425 46.4026 175.811 46.7094C176.197 47.0162 176.69 47.1697 177.288 47.1697Z"
                  fill="#939292"
                />
                <path
                  d="M141.472 146.215C145.673 139.6 155.327 139.6 159.528 146.215L230.566 258.072C235.088 265.192 229.973 274.5 221.539 274.5H79.4614C71.0268 274.5 65.9117 265.192 70.4336 258.072L141.472 146.215Z"
                  fill="#F3F3F3"
                />
                <path
                  d="M334.284 176.654C338.42 169.629 348.58 169.629 352.716 176.654L401.126 258.88C405.323 266.009 400.183 275 391.91 275H295.09C286.817 275 281.677 266.009 285.874 258.88L334.284 176.654Z"
                  fill="#F3F3F3"
                />
                <path
                  d="M240.081 98.306C243.681 93.9839 250.319 93.9839 253.919 98.306L371.527 239.48C376.414 245.346 372.243 254.25 364.608 254.25H129.392C121.757 254.25 117.586 245.346 122.473 239.48L240.081 98.306Z"
                  fill="#F3F3F3"
                />
                <rect x="127" y="206" width="224" height="69" fill="#F3F3F3" />
                <ellipse
                  cx="356.769"
                  cy="108.484"
                  rx="18.5698"
                  ry="16.9818"
                  fill="#F3F3F3"
                />
                <ellipse
                  cx="141.6"
                  cy="210.745"
                  rx="9.2849"
                  ry="8.49091"
                  fill="white"
                />
                <ellipse
                  cx="276.435"
                  cy="189.332"
                  rx="5.24799"
                  ry="4.79921"
                  fill="white"
                />
                <rect
                  x="317.403"
                  y="194.413"
                  width="8.23553"
                  height="49.6442"
                  rx="4.11776"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.562874"
                />
                <rect
                  x="349.221"
                  y="215.655"
                  width="7.48314"
                  height="54.3391"
                  rx="3.74157"
                  transform="rotate(90 349.221 215.655)"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.562874"
                />
                <defs>
                  <filter
                    id="filter0_d_785_3803"
                    x="0.676647"
                    y="0.802396"
                    width="477.647"
                    height="330.647"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1.12575" />
                    <feGaussianBlur stdDeviation="8.16168" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_785_3803"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_785_3803"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            )}

            <div className={`${styles.form_input} dflex-column`}>
              <CustomInput
                type="text"
                placeholder={t("auht.signup.reg_p2.nickname_ph")}
                value={values.UserName}
                onChange={handleChange}
                onBlur={handleBlur}
                name="UserName"
              />
              {touched.UserName && errors.UserName && (
                <div className={styles.error}>{errors.UserName}</div>
              )}

              <CustomInput
                type="email"
                placeholder={t("auht.signup.reg_p2.email_ph")}
                value={values.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="Email"
              />
              {touched.Email && errors.Email && (
                <div className={styles.error}>{errors.Email}</div>
              )}

              <div className={styles.input_menu}>
                <CustomInput
                  type={visible ? "text" : "password"}
                  placeholder={t("auht.signup.reg_p2.password_ph")}
                  value={values.Password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="Password"
                />
                <svg
                  onClick={() => setVisoiblity((visible) => !visible)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21C7 21 1 16 1 12C1 8 7 3 12 3C17 3 23 8 23 12C23 16 17 21 12 21ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7Z"
                    stroke="#939292"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              {touched.Password && errors.Password && (
                <div className={styles.error}>{errors.Password}</div>
              )}

              <div className={styles.input_menu}>
                <CustomInput
                  type={visible2 ? "text" : "password"}
                  placeholder={t("auht.signup.reg_p2.confirm_pass_ph")}
                  value={values.ConfirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="ConfirmPassword"
                />
                <svg
                  onClick={() => setVisoiblity2((visible2) => !visible2)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21C7 21 1 16 1 12C1 8 7 3 12 3C17 3 23 8 23 12C23 16 17 21 12 21ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7Z"
                    stroke="#939292"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              {touched.ConfirmPassword && errors.ConfirmPassword && (
                <div className={styles.error}>{errors.ConfirmPassword}</div>
              )}
            </div>
          </div>

          <div className={styles.selector}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="#D9D9D9" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="#575757" />
            </svg>
          </div>

          <CustomButtonBG
            content={t("auht.signup.reg_p2.btn_next")}
            type="submit"
            disabled={!(dirty && isValid)}
            error={!(dirty && isValid)}
          />
        </Form>
      </FormikProvider>

      <CustomMiniBTN
        content={t("auht.signup.reg_p2.btn_back")}
        onClick={() =>
          dispatch({
            type: "REG-PHASE",
            payload: {
              phase: SelectPhase.phaseOne,
            },
          })
        }
      />
    </>
  );
};

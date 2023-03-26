import axios from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { LazyLoading } from "../../../Components/LazyLoading/LazyLoading";
import styles from "./MessageSelection.module.scss";

export const MessageSelection = () => {
  const [t] = useTranslation("translation");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t("main.message_selection.title_page");
  }, []);

  const getRooms = async () => {
    const { data } = await axios.get("messagebox/get-message-boxs");

    return data;
  };

  const { isLoading, data } = useQuery("getMessageRooms", getRooms);

  if (isLoading) return <LazyLoading />;

  return (
    <div className={styles.messages}>
      <div className={styles.input}>
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.0625 19.0312C5.11875 19.0312 1.09375 15.0062 1.09375 10.0625C1.09375 5.11875 5.11875 1.09375 10.0625 1.09375C10.4213 1.09375 10.7188 1.39125 10.7188 1.75C10.7188 2.10875 10.4213 2.40625 10.0625 2.40625C5.83625 2.40625 2.40625 5.845 2.40625 10.0625C2.40625 14.28 5.83625 17.7187 10.0625 17.7187C14.2887 17.7187 17.7188 14.28 17.7188 10.0625C17.7188 9.70375 18.0163 9.40625 18.375 9.40625C18.7337 9.40625 19.0312 9.70375 19.0312 10.0625C19.0312 15.0062 15.0063 19.0312 10.0625 19.0312ZM19.25 19.9071C19.0837 19.9071 18.9175 19.8459 18.7862 19.7146L17.0362 17.9646C16.9142 17.8411 16.8458 17.6745 16.8458 17.5009C16.8458 17.3272 16.9142 17.1606 17.0362 17.0371C17.29 16.7834 17.71 16.7834 17.9638 17.0371L19.7138 18.7871C19.9675 19.0409 19.9675 19.4609 19.7138 19.7146C19.5825 19.8459 19.4163 19.9071 19.25 19.9071Z"
            fill="#474747"
          />
          <path
            d="M15.3124 8.34754C14.5074 8.34754 12.6349 7.36754 12.0574 5.56504C11.6636 4.33129 12.1186 2.71254 13.5449 2.24879C14.1574 2.04754 14.7961 2.14379 15.3036 2.46754C15.8024 2.14379 16.4586 2.05629 17.0711 2.24879C18.4974 2.71254 18.9611 4.33129 18.5586 5.56504C17.9899 7.40254 16.0211 8.34754 15.3124 8.34754ZM13.3086 5.17129C13.7111 6.44004 15.0761 7.01754 15.3211 7.04379C15.6011 7.01754 16.9399 6.37004 17.3074 5.18004C17.5086 4.54129 17.3074 3.71879 16.6686 3.50879C16.3974 3.42129 16.0299 3.47379 15.8549 3.72754C15.7324 3.91129 15.5399 4.01629 15.3211 4.02504C15.2157 4.02622 15.1114 4.00223 15.0171 3.95506C14.9227 3.90788 14.841 3.83888 14.7786 3.75379C14.5774 3.46504 14.2099 3.42129 13.9474 3.50004C13.3174 3.71004 13.1074 4.53254 13.3086 5.17129Z"
            fill="#474747"
          />
        </svg>

        <input
          type="text"
          placeholder={t("main.message_selection.search_ph").toString()}
        />
      </div>

      <div className={styles.messages_box}>
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className={`${styles.message_user} ${styles.message_inactive}`}
              onClick={() => navigate(`/chat/${item.id}`)}
            >
              <div className={styles.img}>
                {item.userImage ? (
                  <img
                    src={`${process.env.REACT_APP_BASE_RESOURCES}UserImages/${item.userId}/${item.userImage}`}
                    alt=""
                  />
                ) : (
                  <svg
                    width="86"
                    height="86"
                    viewBox="0 0 209 209"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="104.5"
                      cy="104.5"
                      r="102.029"
                      fill="url(#paint0_linear_1675_10359)"
                      fillOpacity="0.5"
                      stroke="#2F2F2F"
                      strokeWidth="4.94119"
                    />
                    <path
                      d="M77.3984 78.5C77.3984 85.4036 71.802 91 64.8984 91C57.9949 91 52.3984 85.4036 52.3984 78.5C52.3984 71.5964 57.9949 66 64.8984 66C71.802 66 77.3984 71.5964 77.3984 78.5Z"
                      fill="#2F2F2F"
                    />
                    <path
                      d="M157.398 78.5C157.398 85.4036 151.802 91 144.898 91C137.995 91 132.398 85.4036 132.398 78.5C132.398 71.5964 137.995 66 144.898 66C151.802 66 157.398 71.5964 157.398 78.5Z"
                      fill="#2F2F2F"
                    />
                    <path
                      d="M84.8984 146H124.898"
                      stroke="#2F2F2F"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1675_10359"
                        x1="-40.5348"
                        y1="188.1"
                        x2="212.652"
                        y2="182.514"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#48D824" />
                        <stop offset="1" stopColor="#10D0EA" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
              <div className={styles.message_select}>
                <div className={styles.message_text}>
                  <div className={styles.message_name}>{item.name}</div>
                  <div className={styles.message}>{item?.lastMessage}</div>
                </div>
                <div className={styles.message_icon}>
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.5402 29.3853C21.0807 29.3853 19.5436 29.0366 17.9548 28.3649C16.4048 27.7062 14.8419 26.802 13.3177 25.7041C11.8065 24.5933 10.3469 23.3533 8.96482 21.997C7.59565 20.6149 6.35565 19.1553 5.25773 17.657C4.1469 16.107 3.25565 14.557 2.62273 13.0587C1.95107 11.457 1.61523 9.907 1.61523 8.44742C1.61523 7.43992 1.79607 6.48409 2.14482 5.59284C2.50648 4.67575 3.08773 3.82325 3.87565 3.087C4.87023 2.10534 6.0069 1.6145 7.22107 1.6145C7.72482 1.6145 8.24148 1.73075 8.68065 1.93742C9.1844 2.16992 9.61065 2.51867 9.92065 2.98367L12.9173 7.20742C13.1886 7.582 13.3952 7.94367 13.5373 8.30534C13.7052 8.69284 13.7957 9.08034 13.7957 9.45492C13.7957 9.94575 13.6536 10.4237 13.3823 10.8758C13.1449 11.2792 12.8538 11.6486 12.5169 11.9737L11.6386 12.8908C11.6515 12.9295 11.6644 12.9553 11.6773 12.9812C11.8323 13.2524 12.1423 13.7174 12.7365 14.4149C13.3694 15.1383 13.9636 15.797 14.5577 16.4041C15.3198 17.1533 15.9527 17.7474 16.5469 18.2383C17.2832 18.8583 17.7611 19.1683 18.0452 19.3103L18.0194 19.3749L18.9623 18.4449C19.3627 18.0445 19.7502 17.7474 20.1248 17.5537C20.8352 17.1145 21.7394 17.037 22.6436 17.4116C22.9794 17.5537 23.3411 17.7474 23.7286 18.0187L28.0169 21.067C28.4948 21.3899 28.8436 21.8033 29.0502 22.2941C29.244 22.7849 29.3344 23.237 29.3344 23.6891C29.3344 24.3091 29.1923 24.9291 28.9211 25.5103C28.6498 26.0916 28.314 26.5953 27.8877 27.0603C27.1515 27.8741 26.3507 28.4553 25.4207 28.8299C24.5294 29.1916 23.5607 29.3853 22.5402 29.3853ZM7.22107 3.552C6.51065 3.552 5.8519 3.862 5.21898 4.482C4.62482 5.03742 4.21148 5.6445 3.95315 6.30325C3.6819 6.97492 3.55273 7.68534 3.55273 8.44742C3.55273 9.64867 3.8369 10.9533 4.40523 12.2966C4.98648 13.6658 5.80023 15.0866 6.83357 16.5074C7.8669 17.9283 9.04232 19.3103 10.334 20.6149C11.6257 21.8937 13.0206 23.082 14.4544 24.1283C15.8494 25.1487 17.2831 25.9753 18.704 26.5695C20.9127 27.5124 22.9794 27.732 24.6844 27.0216C25.3432 26.7503 25.9244 26.337 26.454 25.7428C26.7511 25.4199 26.9836 25.0712 27.1773 24.6578C27.3323 24.3349 27.4098 23.9991 27.4098 23.6633C27.4098 23.4566 27.3711 23.2499 27.2677 23.0174C27.1852 22.8574 27.06 22.7233 26.9061 22.6299L22.6177 19.5816C22.3594 19.4008 22.1269 19.2716 21.9073 19.1812C21.6231 19.0649 21.5069 18.9487 21.0677 19.2199C20.8094 19.3491 20.5769 19.5428 20.3186 19.8012L19.3369 20.7699C18.8332 21.2608 18.0582 21.377 17.464 21.1574L17.1152 21.0024C16.5857 20.7183 15.9657 20.2791 15.2811 19.6978C14.6611 19.1683 13.9894 18.5483 13.1757 17.7474C12.5427 17.1016 11.9098 16.417 11.2511 15.6549C10.644 14.9445 10.2048 14.3374 9.93357 13.8337L9.77857 13.4462C9.70107 13.1491 9.67523 12.9812 9.67523 12.8003C9.67523 12.3353 9.84315 11.922 10.1661 11.5991L11.1348 10.5916C11.3932 10.3333 11.5869 10.0878 11.7161 9.86825C11.8194 9.70034 11.8582 9.55825 11.8582 9.42909C11.8582 9.32575 11.8194 9.17075 11.7548 9.01575C11.6644 8.80909 11.5223 8.57659 11.3415 8.33117L8.34482 4.0945C8.2239 3.92096 8.05894 3.78275 7.8669 3.69409C7.66023 3.60367 7.44065 3.552 7.22107 3.552ZM18.0194 19.3878L17.8127 20.2662L18.1615 19.362C18.0969 19.3491 18.0452 19.362 18.0194 19.3878Z"
                      fill="#575757"
                    />
                  </svg>
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.959 27.4478H9.04232C4.32773 27.4478 1.61523 24.7353 1.61523 20.0208V10.9791C1.61523 6.2645 4.32773 3.552 9.04232 3.552H21.959C26.6736 3.552 29.3861 6.2645 29.3861 10.9791V20.0208C29.3861 24.7353 26.6736 27.4478 21.959 27.4478ZM9.04232 5.4895C5.34815 5.4895 3.55273 7.28492 3.55273 10.9791V20.0208C3.55273 23.7149 5.34815 25.5103 9.04232 25.5103H21.959C25.6532 25.5103 27.4486 23.7149 27.4486 20.0208V10.9791C27.4486 7.28492 25.6532 5.4895 21.959 5.4895H9.04232Z"
                      fill="#575757"
                    />
                    <path
                      d="M15.5007 20.3438C12.8269 20.3438 10.6569 18.1738 10.6569 15.5001C10.6569 12.8263 12.8269 10.6563 15.5007 10.6563C18.1744 10.6563 20.3444 12.8263 20.3444 15.5001C20.3444 18.1738 18.1744 20.3438 15.5007 20.3438ZM15.5007 12.5938C13.899 12.5938 12.5944 13.8984 12.5944 15.5001C12.5944 17.1017 13.899 18.4063 15.5007 18.4063C17.1023 18.4063 18.4069 17.1017 18.4069 15.5001C18.4069 13.8984 17.1023 12.5938 15.5007 12.5938ZM24.5423 10.0105H20.6673C20.1377 10.0105 19.6986 9.57133 19.6986 9.04175C19.6986 8.51216 20.1377 8.073 20.6673 8.073H24.5423C25.0719 8.073 25.5111 8.51216 25.5111 9.04175C25.5111 9.57133 25.0719 10.0105 24.5423 10.0105ZM10.334 22.9272H6.45898C5.9294 22.9272 5.49023 22.488 5.49023 21.9584C5.49023 21.4288 5.9294 20.9897 6.45898 20.9897H10.334C10.8636 20.9897 11.3027 21.4288 11.3027 21.9584C11.3027 22.488 10.8636 22.9272 10.334 22.9272Z"
                      fill="#575757"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        {/* <div
          onClick={() => navigate("/chat")}
          className={`${styles.message_user} ${styles.message_active}`}
        >
          <div className={styles.img}>
            <img
              src={
                process.env.PUBLIC_URL +
                "/Assets/Img/monkey-selfie_custom-7117031c832fc3607ee5b26b9d5b03d10a1deaca-s1100-c50.jpg"
              }
              alt=""
            />
            <div>1</div>
          </div>
          <div className={styles.message_select}>
            <div className={styles.message_text}>
              <div className={styles.message_name}>Рома Чорний</div>
              <div className={styles.message}>Хай бразар))</div>
            </div>
            <div className={styles.message_icon}>
              <svg
                width="31"
                height="31"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5402 29.3853C21.0807 29.3853 19.5436 29.0366 17.9548 28.3649C16.4048 27.7062 14.8419 26.802 13.3177 25.7041C11.8065 24.5933 10.3469 23.3533 8.96482 21.997C7.59565 20.6149 6.35565 19.1553 5.25773 17.657C4.1469 16.107 3.25565 14.557 2.62273 13.0587C1.95107 11.457 1.61523 9.907 1.61523 8.44742C1.61523 7.43992 1.79607 6.48409 2.14482 5.59284C2.50648 4.67575 3.08773 3.82325 3.87565 3.087C4.87023 2.10534 6.0069 1.6145 7.22107 1.6145C7.72482 1.6145 8.24148 1.73075 8.68065 1.93742C9.1844 2.16992 9.61065 2.51867 9.92065 2.98367L12.9173 7.20742C13.1886 7.582 13.3952 7.94367 13.5373 8.30534C13.7052 8.69284 13.7957 9.08034 13.7957 9.45492C13.7957 9.94575 13.6536 10.4237 13.3823 10.8758C13.1449 11.2792 12.8538 11.6486 12.5169 11.9737L11.6386 12.8908C11.6515 12.9295 11.6644 12.9553 11.6773 12.9812C11.8323 13.2524 12.1423 13.7174 12.7365 14.4149C13.3694 15.1383 13.9636 15.797 14.5577 16.4041C15.3198 17.1533 15.9527 17.7474 16.5469 18.2383C17.2832 18.8583 17.7611 19.1683 18.0452 19.3103L18.0194 19.3749L18.9623 18.4449C19.3627 18.0445 19.7502 17.7474 20.1248 17.5537C20.8352 17.1145 21.7394 17.037 22.6436 17.4116C22.9794 17.5537 23.3411 17.7474 23.7286 18.0187L28.0169 21.067C28.4948 21.3899 28.8436 21.8033 29.0502 22.2941C29.244 22.7849 29.3344 23.237 29.3344 23.6891C29.3344 24.3091 29.1923 24.9291 28.9211 25.5103C28.6498 26.0916 28.314 26.5953 27.8877 27.0603C27.1515 27.8741 26.3507 28.4553 25.4207 28.8299C24.5294 29.1916 23.5607 29.3853 22.5402 29.3853ZM7.22107 3.552C6.51065 3.552 5.8519 3.862 5.21898 4.482C4.62482 5.03742 4.21148 5.6445 3.95315 6.30325C3.6819 6.97492 3.55273 7.68534 3.55273 8.44742C3.55273 9.64867 3.8369 10.9533 4.40523 12.2966C4.98648 13.6658 5.80023 15.0866 6.83357 16.5074C7.8669 17.9283 9.04232 19.3103 10.334 20.6149C11.6257 21.8937 13.0206 23.082 14.4544 24.1283C15.8494 25.1487 17.2831 25.9753 18.704 26.5695C20.9127 27.5124 22.9794 27.732 24.6844 27.0216C25.3432 26.7503 25.9244 26.337 26.454 25.7428C26.7511 25.4199 26.9836 25.0712 27.1773 24.6578C27.3323 24.3349 27.4098 23.9991 27.4098 23.6633C27.4098 23.4566 27.3711 23.2499 27.2677 23.0174C27.1852 22.8574 27.06 22.7233 26.9061 22.6299L22.6177 19.5816C22.3594 19.4008 22.1269 19.2716 21.9073 19.1812C21.6231 19.0649 21.5069 18.9487 21.0677 19.2199C20.8094 19.3491 20.5769 19.5428 20.3186 19.8012L19.3369 20.7699C18.8332 21.2608 18.0582 21.377 17.464 21.1574L17.1152 21.0024C16.5857 20.7183 15.9657 20.2791 15.2811 19.6978C14.6611 19.1683 13.9894 18.5483 13.1757 17.7474C12.5427 17.1016 11.9098 16.417 11.2511 15.6549C10.644 14.9445 10.2048 14.3374 9.93357 13.8337L9.77857 13.4462C9.70107 13.1491 9.67523 12.9812 9.67523 12.8003C9.67523 12.3353 9.84315 11.922 10.1661 11.5991L11.1348 10.5916C11.3932 10.3333 11.5869 10.0878 11.7161 9.86825C11.8194 9.70034 11.8582 9.55825 11.8582 9.42909C11.8582 9.32575 11.8194 9.17075 11.7548 9.01575C11.6644 8.80909 11.5223 8.57659 11.3415 8.33117L8.34482 4.0945C8.2239 3.92096 8.05894 3.78275 7.8669 3.69409C7.66023 3.60367 7.44065 3.552 7.22107 3.552ZM18.0194 19.3878L17.8127 20.2662L18.1615 19.362C18.0969 19.3491 18.0452 19.362 18.0194 19.3878Z"
                  fill="#575757"
                />
              </svg>
              <svg
                width="31"
                height="31"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.959 27.4478H9.04232C4.32773 27.4478 1.61523 24.7353 1.61523 20.0208V10.9791C1.61523 6.2645 4.32773 3.552 9.04232 3.552H21.959C26.6736 3.552 29.3861 6.2645 29.3861 10.9791V20.0208C29.3861 24.7353 26.6736 27.4478 21.959 27.4478ZM9.04232 5.4895C5.34815 5.4895 3.55273 7.28492 3.55273 10.9791V20.0208C3.55273 23.7149 5.34815 25.5103 9.04232 25.5103H21.959C25.6532 25.5103 27.4486 23.7149 27.4486 20.0208V10.9791C27.4486 7.28492 25.6532 5.4895 21.959 5.4895H9.04232Z"
                  fill="#575757"
                />
                <path
                  d="M15.5007 20.3438C12.8269 20.3438 10.6569 18.1738 10.6569 15.5001C10.6569 12.8263 12.8269 10.6563 15.5007 10.6563C18.1744 10.6563 20.3444 12.8263 20.3444 15.5001C20.3444 18.1738 18.1744 20.3438 15.5007 20.3438ZM15.5007 12.5938C13.899 12.5938 12.5944 13.8984 12.5944 15.5001C12.5944 17.1017 13.899 18.4063 15.5007 18.4063C17.1023 18.4063 18.4069 17.1017 18.4069 15.5001C18.4069 13.8984 17.1023 12.5938 15.5007 12.5938ZM24.5423 10.0105H20.6673C20.1377 10.0105 19.6986 9.57133 19.6986 9.04175C19.6986 8.51216 20.1377 8.073 20.6673 8.073H24.5423C25.0719 8.073 25.5111 8.51216 25.5111 9.04175C25.5111 9.57133 25.0719 10.0105 24.5423 10.0105ZM10.334 22.9272H6.45898C5.9294 22.9272 5.49023 22.488 5.49023 21.9584C5.49023 21.4288 5.9294 20.9897 6.45898 20.9897H10.334C10.8636 20.9897 11.3027 21.4288 11.3027 21.9584C11.3027 22.488 10.8636 22.9272 10.334 22.9272Z"
                  fill="#575757"
                />
              </svg>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

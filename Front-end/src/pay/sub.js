import React from "react"
import { useTranslation } from "react-i18next"
import { Modal, Card, Button, Radio, message } from "antd";
import { getToken } from "../utils/storage";
import { ajax } from "../utils/request";
import "./sub.css"


export default function Subscribe() {
  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = Modal;
  const { t } = useTranslation();
  const [count, setCount] = React.useState(1);
  const [userData, setUserData] = React.useState(null);

  const showConfirm = () => {
    confirm({
      title: t("book.tipTitle"),
      content: t("book.tipContent"),
      onOk() {
        window.location.href = "/";
      },
      onCancel() {
        window.location.href = "/";
      },
    });
  };

  const handleSubscribe = () => {
    ajax.get(`/user/book/${count}`)
      .then(res => {
        let { code } = res.data
        if (code ===0) {
          messageApi.open({
            type: "success",
            content: t("book.success"),
            duration: 3
          })
        } else {
          messageApi.open({
            type: "error",
            content: t("book.failed"),
            duration: 3
          })
        }
      }
      )
  }
  React.useEffect(() => {
    getToken()
      .then((token) => {
        if (token) {
          ajax.get(`/user/me`)
            .then(res => {
              let { data } = res.data;
              setUserData(data);
            })
        }
        else {
          showConfirm();
        }
      })
  }, [count])
  return (
    <div className="w-full flex flex-row justify-center">
      {contextHolder}
      <div className="md:max-w-[980px] flex flex-col md:flex-row w-full text-[16px]">
        <div className="subscribe-info w-1/2 h-[100vh] flex flex-col pr-[65px] pt-[80px]">

          <div className="text-[hsla(0,0%,10%,.6)]" >{t("book.text1")}</div>
          <div className="price flex flex-row items-center mt-[.5em]">
            <div className="digtal text-[36px] font-bold">
              $4.99
            </div>
            <div className="text pl-[10px] text-[18px] text-[hsla(0,0%,10%,.6)]">
              {t("book.text2")}
            </div>

          </div>

          <div className="plan text-[15px] mt-[40px]">
            <div className="flex flex-row justify-between">
              <div className="">DisPDF - Pro</div>
              <div className="">$4.99</div>
            </div>
          </div>
          <div className="flex flex-row justify-between text-[16px] items-center">
            <div className="text-[hsla(0,0%,10%,.6)]">{t("book.text3")}</div>
            <div className="mt-[10px]">
              <span>✖️</span>
              <input className="h-[1.2em] w-[1.5em] text-right" value={count} onChange={e => {
                setCount(e.target.value)
              }} />
              <span className="pl-[3px]">{t("book.text6")}</span>
            </div>
          </div>
          <div className="count flex flex-row justify-between text-[16px] mt-[50px]">
            <div className="">{t("book.text5")}</div>
            <div className="">$ {(count * 4.99).toFixed(2)}</div>
          </div>
          <div className="w-full mt-[25px]">
            <img className="w-full" src="/images/wechat.png" alt="group"></img>
          </div>
        </div>
        <div className="pay w-1/2 h-full pl-[65px] pt-[80px] flex flex-col ">
          <div className="pb-[16px] text-[hsla(0,0%,10%,.6)] text-[18px]">
            {t("book.contact")}
          </div>
          <div className="email py-[8px] px-[5px] rounded-lg flex flex-row items-center">
            <span className="text-[#1a1a1ab2]">Email:</span>
            <span className="pl-[25px] text-[hsla(0,0%,10%,.9)] text-[14px]">
              {userData && userData.email}
            </span>
          </div>

          <Card title={"Pro"} className="card mt-[30px]">
            <ul className="px-[22px]">
              <li className="mb-[15px]"> <span className="font-bold text-[24px]">$4.99</span> /mo </li>
              <li> <span className="font-bold">25 MB</span> /PDF </li>
              <li> <span className="font-bold">20 PDFs</span> /day </li>
              <li> <span className="font-bold">500 questions</span> /day </li>
              <li> <span className="font-bold">1,000 pages</span> /PDF </li>
            </ul>
          </Card>

          <div className="agree my-[20px]">
            <Radio>
              {t("book.a1")}
              <a href="/privacy-policy.html" className="u px-[2px] underline">{t("book.a4")}</a>
              {t("book.a3")}
              <a href="/tos.html" className="u underline px-[2px]">{t("book.a2")}</a>
            </Radio>
          </div>

          <div className="confirm">
            <Button type="primary" className="w-full h-[35px] mt-[10px] mb-[30px] font-bold"
              onClick={handleSubscribe}
            >
              {t("book.subscribe")}
            </Button>
          </div>

          <div className="text">
            {t("book.tip2")}
          </div>
        </div>
      </div>
    </div>
  )
}
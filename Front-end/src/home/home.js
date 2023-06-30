import "./home.css"
import React from "react"
import { Card } from "antd"
import { Check } from "../components/icons"

import Register from "../components/register"
import Login from "../components/login"
import { getToken } from "../utils/storage"
import { useTranslation } from "react-i18next"
import Account from "../components/account"
import FAQ from "../components/faq"

export default function Home() {
  const { t, i18n } = useTranslation();

  /* change langaue */
  const changeLanguage = () => {
    if (i18n.language && i18n.language === "en") {
      i18n.changeLanguage("zh");
    } else {
      i18n.changeLanguage("en");
    }
  }

  const [isLogin, setIsLogin] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [faqOpen, setFaqOpen] = React.useState(false);

  React.useEffect(() => {
    getToken()
      .then((token) => {
        if (token) {
          setIsLogin(true);
        }
      })
  }, [])

  const clickLogin = () => {
    setLoginOpen(true);
  }


  return (
    <div className="home w-full flex flex-col items-center bg-[#f5f5f7] min-h-[100vh]">

      <Register isOpen={registerOpen} setOpen={setRegisterOpen} setLoginOpen={setLoginOpen} />
      <Login isOpen={loginOpen} setOpen={setLoginOpen} setRegisterOpen={setRegisterOpen} setIsLogin={setIsLogin} />
      <Account isOpen={accountOpen} setOpen={setAccountOpen} />
      <FAQ isOpen={faqOpen} setOpen={setFaqOpen} />

      <div className="container flex flex-col items-center w-full max-w-[936px] px-[6px]">
        <div className="intro flex flex-col items-center w-full text-center">
          <div className="title-intro mt-[35px] whitespace-normal text-[var(--black-text)] text-[24px] font-bold md:text-[42px]">PDF   X  OpenAI  =  dispdf.com</div>
          <p className="typography-intro mt-[25px] text-[16px] md:text-[20px]">{t("home.intro_text")}</p>
          <p className="text-[16px] md:text-[20px]">{t("home.experience_text")}</p>
          <div className="flex flex-row gap-2 items-center">
            <a className="button-start" href="/c/start">{t("home.start_experience")}</a>
            {
              isLogin ?
                <div className="button-start" onClick={() => { setAccountOpen(true) }} >{t("home.footer_text1")}</div>

                : <div className="button-start" onClick={clickLogin} >{t("home.footer_text2")}</div>
            }
          </div>

          <img
            alt="intro"
            src="https://pic.lookcos.cn/i/2023/05/22/116kxg3.png"
            className="m mt-[24px] max-w-[1125px] overflow-visible w-full md:w-full md:min-w-[unset] lg:mt-[15px]"
          />

        </div>

        <div className="w-full flex mt-[36px] gap-[12px] flex-col md:justify-center md:flex-wrap md:flex-row">

          <Card title={t("home.academic_use")} className="md:max-w-[300px]">
            <p><span><Check fill="#000" size={16} /></span>{t("home.student1")} </p>
            <p className="pt-[5px]"><span><Check fill="#000" size={16} /></span>{t("home.student2")}</p>
            <p className="pt-[5px]"><span><Check fill="#000" size={16} /></span>{t("home.student3")}</p>
          </Card>

          <Card title={t("home.business_use")} className="md:max-w-[300px]">
            <p><span><Check fill="#000" size={16} /></span>{t("home.b1")} </p>
            <p className="pt-[5px]"><span><Check fill="#000" size={16} /></span>{t("home.b2")}</p>
          </Card>

          <Card title={t("home.service_promise")} className="md:max-w-[300px]">
            <p><span><Check fill="#000" size={16} /></span>{t("home.service_promise1")}</p>
            <p className="pt-[5px]"><span><Check fill="#000" size={16} /></span>{t("home.service_promise2")}</p>
            <p className="pt-[5px]"><span><Check fill="#000" size={16} /></span>{t("home.service_promise3")}</p>
            <p className="pt-[5px]"><span><Check fill="#000" size={16} /></span>{t("home.service_promise4")}</p>
          </Card>
        </div>

        <div className="footer w-full mt-[auto] pt-[26px] cursor-pointer flex flex-row items-center justify-center text-[14px]">
          {
            isLogin ?
              <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]" onClick={() => { setAccountOpen(true) }}>{t("home.footer_text1")}</div>
              : <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]" onClick={clickLogin}>{t("home.footer_text2")}</div>
          }

          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]"> - </div>
          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]" onClick={() => {
            setAccountOpen(true);
          }}>{t("home.footer_text3")}</div>
          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]"> - </div>
          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]" onClick={() => {
            setFaqOpen(true);
          }}> {t("home.faq")} </div>

          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]"> - </div>
          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]" onClick={() => {
            window.open("./privacy-policy.html")
          }}>{t("home.footer_text4")}</div>
          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]"> - </div>
          <div className="item px-[3px] text-[#969699] hover:text-[var(--blue-text)]" onClick={changeLanguage}> {t("selectLang")} </div>
        </div>
        <div className="footer desc w-full text-center text-[#969696] text-[14px]">
          {t("footer")}
        </div>

      </div>
    </div >
  )
}
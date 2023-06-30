import "./index.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import React from "react";

import Chat from "../components/chat"
import Search from "../components/search";
import PdfUploader from "../components/pdfuploader";
import PDFReader from "../components/pdfreader";
import { MsgSVG } from "../components/icons";

import { baseUrl, ajax } from "../utils/request";
import { savePdfToForage } from "../utils/storage";
import { computeFileMD5 } from "../utils/utils";
import { message } from "antd";
import { saveSiderToForage, getSiderFromForage, getToken } from "../utils/storage";
import { useTranslation } from "react-i18next";
import Account from "../components/account";
import Register from "../components/register";
import Login from "../components/login";


export default function Work() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [windowHeight, setWindowHeight] = React.useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const pdfListRef = React.useRef([]);
  const [pdfList, setPdfList] = React.useState(pdfListRef.current);
  const { fid } = useParams();
  const [currPDF, setCurrPDF] = React.useState(null);
  const [isLogin, setIsLogin] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);


  React.useEffect(() => {
    setWindowHeight(window.innerHeight);
    // 判断是否登录
    getToken().then((token) => {
      if (!token) return;
      setIsLogin(true);
    })
  }, []);

  React.useEffect(() => {
    console.log("pdfList", pdfList);
    console.log(pdfListRef.current)
    //setPdfList(pdfListRef.current);
  }, [pdfList]);

  React.useEffect(() => {
    getSiderFromForage()
      .then((data) => {
        if (!data) return;
        pdfListRef.current = data;
        setPdfList(data);
        const getCurrentPdf = () => {
          return pdfListRef.current.find((item) => item.sign === fid);
        }
        setCurrPDF(getCurrentPdf());
      });
  }, [fid]);


  function handleUpload(fileList) {
    // 实现上传处理函数
    const reader = new FileReader();
    reader.onload = async function (e) {
      let size = fileList[0].size;
      console.log(size);
      // 500 表示 50Mb
      const DIV = 1000000;
      console.log(size / DIV)
      if (size > DIV && (size / DIV) > 50) {
        messageApi.open({
          type: "error",
          content: t("fileTooLarge"),
          duration: 2
        })
        return;
      }

      let md5 = await computeFileMD5(fileList[0]);
      savePdfToForage(md5, e.target.result)
      // 判断是否需要上传
      ajax.get(`/chat/init/${md5}`)
        .then((res) => {
          if (res.status === 200) {
            addToPDFList(md5, fileList[0].name);
            return;
          }
        })
        .catch(err => {
          UploadPDF(fileList[0])
        })
    }
    reader.readAsDataURL(fileList[0]);
  }


  // 将其添加至pdfListRef中，并跳转
  function addToPDFList(sign, name) {
    if (pdfListRef.current.find((item) => item.sign === sign)) {
      navigate(`/c/${sign}`);
      return;
    }
    pdfListRef.current.unshift({ sign, name });
    saveSiderToForage(pdfListRef.current);
    setPdfList(pdfListRef.current);
    navigate(`/c/${sign}`);
  }

  function UploadPDF(file) {
    const formData = new FormData();
    formData.append("file", file, file.name);

    var myHeaders = new Headers();
    myHeaders.append("User-Agent", "PinkFlow/1.0");

    // 提示上传状态
    messageApi.open({
      type: 'loading',
      content: t("uploading"),
      duration: 0,
    });

    ajax.post(`${baseUrl}/upload/pdf`, formData, {
      headers: myHeaders
    })
      .then(res => {
        messageApi.destroy();
        if (res.data.code === -1) {
          messageApi.open({
            type: "error",
            content: t("fileTooLarge"),
            duration: 2
          })
          return;
        }
        addToPDFList(res.data.data.sign, file.name);
      })
      .catch(err => {
        if (err.response.status === 403) {
          messageApi.open({
            type: "error",
            content: t("uploadLimited"),
            duration: 3
          })
          setTimeout(() => {
            messageApi.destroy();
          }, 3000);

          return;
        }
        console.log(err);
      });
  }

  return (
    <div className="main h-full w-full">
      <div className="wrapper flex flex-row " >
        {contextHolder}
        <Register isOpen={registerOpen} setOpen={setRegisterOpen} setLoginOpen={setLoginOpen} />
        <Login isOpen={loginOpen} setOpen={setLoginOpen} setRegisterOpen={setRegisterOpen} setIsLogin={setIsLogin} />
        <Account isOpen={accountOpen} setOpen={setAccountOpen} />
        <div className="sider flex flex-col w-[256px] pb-[24px] bg-[#f5f5f7] overflow-auto" style={{ height: windowHeight }}>
          <div className="sider-content">
            <div className="sider-title font-bold mx-[8px] my-[8px] pb-[4px] text-[20px]">{t("work.title")}</div>

            <PdfUploader handleUpload={handleUpload} />

            <div className="pdf-list flex flex-col my-[8px]">
              {
                pdfList && pdfList.map((item, index) => {
                  return (
                    // eslint-disable-next-line
                    <Link to={`/c/${item.sign}`} key={index} className={`${item.sign == fid ? "active" : ""} pdf-item rounded-md px-[8px] text-[14px] flex flex-row items-center h-[40px] `}>
                      <span>
                        <MsgSVG fill={ // eslint-disable-next-line 
                          `${item.sign == fid ? '#fff' : "#000"}`} size="18" />
                      </span>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden ml-[5px]">
                        {item.name}
                      </span>
                    </Link>
                  )
                })
              }

            </div>
          </div>
          <div className="sider-footer text-[#969696] flex gap-[9px] px-[8px] text-[14px] hover:text-[var(--blue-text)] cursor-pointer">
            <a className="text-[#969696] text-[14px]" href="/">{t("index")}</a>
            {isLogin ?
              <div className="" onClick={()=>{
                setAccountOpen(true);
              }}>{t("home.footer_text1")}</div> :
              <div className="" onClick={()=>{
                setLoginOpen(true);
              }}>{t("home.footer_text2")}</div>
            }
          </div>
        </div>

        <div className="content flex flex-row w-[calc(100vw-256px)]">
          <div className="chat w-1/2  bg-[white]  flex flex-row justify-center" >
            <Chat pdf={currPDF} setPdfList={setPdfList} pdfListRef={pdfListRef} />
          </div>

          <div className="show w-1/2  bg-[white] flex flex-col">

            <div className="pdf-reader h-3/4 ">
              <PDFReader pdfData={currPDF} />
            </div>

            <div className="fuzzy h-1/4  mt-[auto] flex flex-col items-center">
              <Search pdf={currPDF}></Search>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
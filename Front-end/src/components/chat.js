import { Send } from './icons';
import React from 'react';
import "./chat.css";
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/storage';
import { Download, Trash } from './icons';
import { ajax, baseUrl } from '../utils/request';
import { message } from 'antd';
import { getChatHistoryFromForage, saveChatHistoryToForage, removePdfFromForage, removeSiderItemFromForage, getSiderFromForage } from '../utils/storage';
import { Popconfirm, Tooltip } from "antd";
import { useTranslation } from 'react-i18next';

export default function Chat({ pdf, pdfListRef, setPdfList }) {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { t, i18n } = useTranslation();
  const textAreaRef = React.useRef(null);
  const chatContentRef = React.useRef(null);
  const chatListRef = React.useRef([]);
  const [token, setToken] = React.useState(null);

  const [chatList, setChatList] = React.useState(chatListRef.current);
  const [windowHeight, setWindowHeight] = React.useState(0);
  // 是否正在回答中
  const [isAnswering, setIsAnswering] = React.useState(false);
  // 是否正在加载中，还没获取到答案
  const [isLoading, setIsLoading] = React.useState(false);

  const [question, setQuestion] = React.useState('');


  React.useEffect(() => {
    getToken()
      .then(data => {
        if (!data) return;
        setToken(data)
      })
    setWindowHeight(window.innerHeight);
  }, []);


  React.useEffect(() => {
    function init() {
      chatListRef.current = [];
      setChatList([]);
      setQuestion('');
      setIsAnswering(false);
      setIsLoading(false);
    }
    if (!pdf) return;
    console.log(pdf, "新的路由跳转")
    init();
    let { sign } = pdf;
    getChatHistoryFromForage(sign)
      .then(data => {
        console.log(sign, data)
        // 如果缓存中没有聊天记录，则需要请求初始化此文件
        if (!data || data.length === 0) {
          console.log("chat.js 无聊天记录，开始初始化...")
          setIsLoading(true);
          initPdfChat(sign);
        }
        // 如果缓存中有聊天记录，则直接使用
        else {
          console.log("chat.js 有聊天记录，直接使用")
          chatListRef.current = data;
          setChatList(data);
        }
      })
  }, [pdf]);

  React.useEffect(() => {
    chatContentRef.current.scrollTo({
      top: chatContentRef.current.scrollHeight,
      behavior: "smooth"
    });

    if (!pdf) return;
    saveChatHistoryToForage(pdf.sign, chatList);
  }, [chatList])

  const fetchResponse = (question) => {
    setIsLoading(true);
    setIsAnswering(true);

    let isFirst = true;
    let sources = "";
    let isSourceSegment = true;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("Authorization", `Bearer ${token}`);
    let payload = { sign: pdf.sign, content: i18n.language === "zh-CN" || i18n.language === "zh" ? question + "，请使用中文回答" : question };

    fetch(`${baseUrl}/chat/`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(payload),
    }).then(response => {
      console.log(response)
      if (response.status === 403) {
        console.log("今日次数已用完")
        setIsAnswering(false);
        setIsLoading(false);
        messageApi.open({
          type: "error",
          content: t("questionLimited"),
          duration: 2,
        });
        return
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      function read() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            setIsAnswering(false);
            return true;
          }
          let val = decoder.decode(value, { stream: true });

          // 判断是否为来源段
          if (isSourceSegment) {
            sources += val;
            isSourceSegment = false;
          } else {
            if (isFirst) {
              newMessage('ai', '');
              setIsLoading(false);
              isFirst = false;
              updateLastMessage(val.trim().replace(/^\n/, ""));
            } else {
              updateLastMessage(val);
            }
          }
          return read();
        })
      }
      return read();
    }).then(() => {
      let list = sources.split("\n\n").map((item, index) => {
        if (index === 0) {
          item = item.slice(65,);
        } else {
          item = item.slice(57,);
        }
        item = item.replace(/\n/g, " ")
        return item;
      })
      updateLastSource(list);
      setIsAnswering(false);
      return true;
    }).catch(err => {
      console.log(err)
      setIsAnswering(false);
    })
  }


  function initPdfChat(sign) {
    ajax.get(`/chat/init/${sign}`)
      .then(res => {
        let { code } = res.data;
        if (code !== 200) return;
        setIsLoading(false);
        setIsAnswering(true);
        console.log("开始获取摘要信息...")
        fetchResponse(t("question"))
      }).catch(err => {
        console.log(err)
        setIsLoading(false);
      });
  }
  const newMessage = (type, message) => {
    chatListRef.current.push({ type, message });
    setChatList(chatListRef.current);
  }

  const updateLastMessage = (message) => {
    let list = chatListRef.current.slice(0);
    list[list.length - 1].message += message;
    chatListRef.current = list;
    setChatList(chatListRef.current);
  }

  const updateLastSource = (source) => {
    let list = chatListRef.current.slice(0);
    list[list.length - 1].source = source;
    chatListRef.current = list;
    setChatList(chatListRef.current);
  }

  const handleEnterKey = (e) => {
    if (isLoading) return;
    // Enter 发送消息，但是 shift + Enter 换行
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const sendMessage = (e) => {
    if (isAnswering) return;
    if (question !== '') {
      newMessage("human", "")
      updateLastMessage(question);
      fetchResponse(question);
      setQuestion('');
      setIsAnswering(true);
    }
  }


  const handleTextChange = () => {
    setQuestion(textAreaRef.current.value);
  }

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    if (textAreaRef.current.scrollHeight >= 230) {
      textAreaRef.current.style.overflowY = "overlay";
    } else {
      textAreaRef.current.style.overflowY = "hidden";
    }
  };

  React.useEffect(resizeTextArea, [question]);

  const hanldeDeleteChat = () => {
    let sign = pdf.sign;
    if (!sign) return;
    if (sign === "start") return;
    if (sign.length !== 32) return;

    let pdfList = pdfListRef.current.slice(0);
    pdfList = pdfList.filter(item => item.sign !== sign);
    pdfListRef.current = pdfList;
    setPdfList(pdfList);

    setChatList([]);
    removePdfFromForage(sign);
    getSiderFromForage().then(data => {
      removeSiderItemFromForage(sign, data).then(() => {
        navigate("/c/start");
      });
    });

    messageApi.open(({
      type: "warning",
      content: t("tip.deleteChat"),
      duration: 2.5,
    }))
  }

  const handleExportChat = () => {
    let sign = pdf.sign;
    if (!sign) return;
    if (sign === "start") return;
    if (sign.length !== 32) return;

    let chatListData = chatListRef.current.slice(0);
    let chatListString = chatListData.map(item => {
      return `${item.type === "human" ? "Me" : "AI"}: ${item.message}\n\n`
    }).join("");
    let blob = new Blob([chatListString], { type: "text/plain;charset=utf-8" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `${sign}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="chat-wrapper w-full max-w-full  flex flex-col" style={{ height: windowHeight }}>
      {contextHolder}
      <div className="chat-list-items flex-grow-1 flex justify-center overflow-auto" ref={chatContentRef}>
        <div className="w-full max-w-[720px]">
        {chatList && chatList.length > 0 &&
             <div className='toolBar flex flex-row items-center justify-start pt-[10px] px-[12px]'>
              <div className='item pr-[12px]'>
                <Tooltip placement="bottom" title="Export Chat" arrow={true}>
                  <button className='outline-none border-none bg-[white] cursor-pointer' onClick={handleExportChat}>
                    <Download size={22} fill="#000" />
                  </button>
                </Tooltip>
              </div>

              <div className='item'>
                <Popconfirm
                  title={t("tip.deleteChatTitle")}
                  description={t("tip.deleteChatContent")}
                  onConfirm={hanldeDeleteChat}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className='outline-none border-none bg-[white] cursor-pointer'>
                    <Trash size={22} fill="#000" />
                  </button>
                </Popconfirm>
              </div>
            </div>}
          <div className="px-[12px] py-[0px]" >
      
            <div className="relative">
              <ul className="chat-list-items" >
                {chatList && chatList.map((item, index) => {

                  return (
                    <div key={index} className={`chat-message-item ${item.type}`}>
                      <div className="chat-message">
                        {item.message}
                      </div>
                    </div>
                  )
                })
                }
                {isLoading && <div className="chat-message-item ai">
                  <div className="chat-message">
                    <Spin size="small"></Spin>
                  </div>
                </div>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <span className="send-container" onKeyDown={handleEnterKey}>
        <textarea placeholder="Ask any question..." className="message-input" rows={1} ref={textAreaRef} value={question} onChange={handleTextChange} > </textarea>
        <button className="message-send" style={{ background: isAnswering || isLoading ? "rgb(187 189 193)" : "#1677ff" }} onClick={() => { sendMessage() }}>
          <span className="flex flex-col items-center text-center text-[14px]">
            <Send size={14} />
          </span>
        </button>
      </span>
    </div>
  )
}
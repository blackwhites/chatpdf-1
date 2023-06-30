import React from "react";
import { SearchSVG } from "./icons";
import { LoadingOutlined } from '@ant-design/icons';
import { ajax } from "../utils/request";

export default function Search({ pdf }) {
  const [text, setText] = React.useState("")
  const [result, setResult] = React.useState([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [windowHeight, setWindowHeight] = React.useState(0);

  React.useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);


  const handleSearch = () => {
    console.log(text)
    if (!pdf || !text) return;
    fetchSearch();
  }

  const fetchSearch = () => {
    setIsSearching(true);
    ajax.post(`/search/${pdf.sign}`, { value: text })
      .then(res => {
        setIsSearching(false);
        let { data } = res.data;
        data = data.map(item => {
          return item.node.text;
        })
        console.log(data);
        setResult(data)
      })
      .catch(err => {
        setIsSearching(false);
        console.log(err)
      })
  }

  return (
    <div className="w-full flex flex-col h-full" style={{ maxHeight: windowHeight / 4 - 1 }}>
      <div className="result max-h-full flex flex-col items-center overflow-auto">
        <div className="result-box flex flex-col px-[12px]">
          {result && result.map((item, index) => {
            return <div className="item bg-[#f3f3f3] rounded-md px-[10px] mb-[20px] text-[12px]">
              <div className="text-[red] font-blod">第 {index+1} 处</div>
              <div className="" key={index}> {item.slice(0, 600)} </div>
            </div>
          })}
        </div>
      </div>
      <span className="send-container mt-[auto]" onKeyDown={() => { }}>
        <textarea placeholder="Search..." value={text} className="message-input" rows={1} onChange={(e) => { setText(e.target.value) }} > </textarea>
        <button className="message-send" style={{ background: isSearching ? "rgb(187 189 193)" : "#1677ff" }} onClick={handleSearch}>
          <span className="flex flex-col items-center text-center text-[14px]">
            {isSearching ? <LoadingOutlined style={{ fontSize: 15 }} /> : <SearchSVG size={15} />}
          </span>
        </button>
      </span>
    </div>

  )
}
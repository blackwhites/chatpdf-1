import React from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { LeftSVG, RightSVG, PlusSVG, SubSVG } from "./icons";
import { getPdfFromStorage } from "../utils/storage";
import { Slider } from "antd";

import "./pdfreader.css"

export default function PDFReader({ pdfData }) {

  const [windowHeight, setWindowHeight] = React.useState(0);
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageInput, setPageInput] = React.useState(1);
  const [data, setData] = React.useState(null);

  const [scale, setScale] = React.useState(1.6);

  React.useEffect(() => {
    setWindowHeight(window.innerHeight);
    pdfjs.GlobalWorkerOptions.workerSrc = `/js/pdf.worker.js`;
  }, []);

  React.useEffect(() => {
    function init() {
      setNumPages(null);
      setPageNumber(1);
      setPageInput(1);
      setData(null);
    }

    if (!pdfData) return;
    let { sign } = pdfData;
    init();
    getPdfFromStorage(sign)
      .then(val => {
        setData(val)
      })
  }, [pdfData])


  React.useEffect(() => {
    setPageInput(pageNumber);
  }, [pageNumber]);

  const handleInputBlur = () => {
    let page = parseInt(pageInput);
    if (page > 0 && page <= numPages) {
      setPageNumber(page);
    }
  }

  function handlePrevPage() {
    if (pageNumber <= 1) return;
    setPageNumber(pageNumber - 1);
  }

  function handleNextPage() {
    if (pageNumber >= numPages) return;
    setPageNumber(pageNumber + 1);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-render w-full h-full flex flex-col justify-center items-center overflow-auto" 
    style={{ maxHeight: windowHeight / 4 * 3 }} >
      {data && <div
        className="pdf-container overflow-auto w-full flex flex-col justify-center items-center"
        
      >
        <Document
          file={data}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document></div>}
      {data && <div className="control flex flex-col w-full items-center">
        <div className="scale inline-flex items-center cursor-pointer mb-[3px]">

          <div className="text text-[14px] pr-[5px]">{
            scale * 100 > 100 ? `${Math.round(scale * 100)}%` : `${Math.round(scale * 100)}%`
          }</div>

          <div className="pr-[3px]" onClick={() => { if (scale > 1) { setScale(scale - 0.1); } }}>
            <SubSVG fill="#000" size="22" />
          </div>
          <Slider className="w-[100px]"  defaultValue={scale} disabled={false} value={scale} min={1} max={2} step={0.1} onChange={v=>{setScale(v)}}/>
          {/* <Slider.Root className="SliderRoot" defaultValue={[1]} value={[scale]} max={2} step={0.1} min={1} aria-label="Volume" onValueChange={(i) => { setScale(i[0]) }}>
            <Slider.Track className="SliderTrack">
              <Slider.Range className="SliderRange" />
            </Slider.Track>
            <Slider.Thumb className="SliderThumb" />
          </Slider.Root> */}

          <div className="pl-[3px]" onClick={() => { if (scale < 2) { setScale(scale + 0.1); } }}>
            <PlusSVG fill="#000" size="22" />
          </div>
        </div>

        <div className="flex flex-row w-full justify-around items-center text-[16px]">
          <div className="left block p-[3px] cursor-pointer rounded-full hover:bg-[#cbcbcb3d]" onClick={handlePrevPage}>
            <LeftSVG fill="#000" size={38} />
          </div>
          <div className="status">
            <div onKeyDown={(e) => { if (e.key === "Enter") { handleInputBlur() } }}>
              <span className="font-bold pr-[8px]">Page：</span> <input type="text" className="" value={pageInput} onChange={(e) => { setPageInput(e.target.value) }} onBlur={handleInputBlur} ></input>
              <span className="px-[10px]">/</span>
              <span className="font-bold px-[5px]">{numPages}</span>
            </div>
          </div>
          <div className="right block p-[3px] cursor-pointer rounded-full hover:bg-[#cbcbcb3d]" onClick={handleNextPage}>
            <RightSVG fill="#000" size={38} />
          </div>
        </div>
      </div>}
    </div>
  )
}
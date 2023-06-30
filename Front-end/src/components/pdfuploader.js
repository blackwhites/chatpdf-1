import React from "react";
import { PlusSVG } from "./icons";
import { useTranslation } from "react-i18next";

export default function PdfUploader({ handleUpload }) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = React.useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const fileList = Array.from(e.dataTransfer.files);
    handleUpload(fileList);
  }

  function handleFileInputChange(e) {
    const fileList = Array.from(e.target.files);
    handleUpload(fileList);
  }

  return (
    <div className="upload-pdf h-[64px] m-[8px] rounded-md bg-[white]"
      style={{ border: dragOver ? "1px dashed var(--blue)" : "1px dashed #00000069" }}>
      <div className="upload-wrapper h-full w-full outline-none cursor-pointer flex flex-col items-center justify-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("pdfInput").click()}
      >
        <input id="pdfInput" type="file" accept=".pdf" className="d hidden cursor-pointer" onChange={handleFileInputChange} />
        <div className="text">
          <span className="inline-flex items-center text-[var(--black-text)] text-[15px]">
            <PlusSVG fill="#000" size="20" />
            {t("work.new_chat")}
          </span>
        </div>
        <div className="desc text-[#515154] text-[14px]">
          {t("work.drop")}
        </div>
      </div>
    </div>
  )
}


export function PdfUploaderV2({ handleUpload }) {
  const [dragOver, setDragOver] = React.useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const fileList = Array.from(e.dataTransfer.files);
    handleUpload(fileList);
  }

  function handleFileInputChange(e) {
    const fileList = Array.from(e.target.files);
    handleUpload(fileList);
  }

  return (
    <div className="bupload-pdf flex flex-col bg-[white] mt-[12px] h-[128px] p-[4px] max-w-[936px] w-full rounded-md">
      <div className="m-[8px] rounded-md h-full"
        style={{ border: dragOver ? "1px dashed var(--blue)" : "1px dashed #00000069" }}>
        <div className="upload-wrapper h-full w-full outline-none cursor-pointer flex flex-col items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("pdfInput").click()}
        >
          <input id="pdfInput" type="file" accept=".pdf" className="d hidden cursor-pointer" onChange={handleFileInputChange} />
          <div className="text">
            <span className="inline-flex items-center text-[var(--black-text)] text-[15px]">
              <PlusSVG fill="#000" size="20" />
              New Chat
            </span>
          </div>
          <div className="desc text-[#515154] text-[16px]">
            Drop PDF here
          </div>
        </div>
      </div>
    </div>
  )
}
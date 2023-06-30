import { Modal } from "antd";
import { useTranslation } from "react-i18next";


export default function FAQ({ isOpen, setOpen }) {
  const { t } = useTranslation();

  function handleCancel() {
    setOpen(false);
  }

  return (
    <Modal
      name="basic"
      title={t("faq.title")}
      centered={true}
      open={isOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="w-full whitespace-pre-line">
        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q1")}</div>
        <div className="mt-[10px]"> {t("faq.a1")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q2")}</div>
        <div className="mt-[10px]"> {t("faq.a2")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q3")}</div>
        <div className="mt-[10px]"> {t("faq.a3")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q4")}</div>
        <div className="mt-[10px]"> {t("faq.a4")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q5")}</div>
        <div className="mt-[10px]"> {t("faq.a5")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q6")}</div>
        <div className="mt-[10px]"> {t("faq.a6")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q7")}</div>
        <div className="mt-[10px]"> {t("faq.a7")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q8")}</div>
        <div className="mt-[10px]"> {t("faq.a8")}</div>

        <div className="mt-[20px] font-bold text-[14px]"> {t("faq.q9")}</div>
        <div className="mt-[10px]"> {t("faq.a9")}<a className="text-[var(--blue-text)]" href = "mailto: dispdf@outlook.com">dispdf@outlook.com</a></div>
      </div>
    </Modal>
  )
}
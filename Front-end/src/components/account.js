import { Modal, Card, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { getToken, removeToken } from "../utils/storage";
import { ajax } from "../utils/request";
import React from "react";

export default function Account({ isOpen, setOpen }) {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      ajax.get(`/user/me`).then((res) => {
        let { data } = res.data;
        setUserData(data);
        console.log(data);
      });
    });
  }, [isOpen]);

  function handleCancel() {
    setOpen(false);
  }

  return (
    <Modal
      name="basic"
      title={t("account.upgrade")}
      centered={true}
      open={isOpen}
      footer={null}
      onCancel={handleCancel}
    >
      {contextHolder}
      {userData && <div className="flex flex-row justify-between items-center gap-2 px-[12px]">
        <div className="text-[14px] font-bold">{userData.email}</div>
        <Button onClick={() => {
          removeToken().then(() => {
            messageApi.open({
              type: "success",
              content: t("logout_success"),
              duration: 3,
              onClose: () => {
                window.location.href = "/"
              }
            })
          })
        }}>{t("logout")}</Button>
      </div>}

      <div className="w-full flex-wrap flex justify-center mt-[16px] gap-2">
        <Card title={"Free"} className="card">
          <ul className="px-[22px]">
            <li className="mb-[15px]"> <span className="font-bold text-[24px]">$0</span> /mo </li>
            <li> <span className="font-bold">10 MB</span> /PDF </li>
            <li> <span className="font-bold">3 PDFs</span> /day </li>
            <li> <span className="font-bold">50 questions</span> /day </li>
            <li> <span className="font-bold">100 pages</span> /PDF </li>
          </ul>
        </Card>

        <Card title={"Pro"} className="card">
          <ul className="px-[22px]">
            <li className="mb-[15px]"> <span className="font-bold text-[24px]">$4.99</span> /mo </li>
            <li> <span className="font-bold">25 MB</span> /PDF </li>
            <li> <span className="font-bold">20 PDFs</span> /day </li>
            <li> <span className="font-bold">500 questions</span> /day </li>
            <li> <span className="font-bold">1,000 pages</span> /PDF </li>
          </ul>
          <Button type="primary" className="w-full mt-[20px]" onClick={() => {
            window.location.href = "/book"
          }}>
            {t("book.subscribe")}
          </Button>
        </Card>
      </div>
    </Modal>
  )
}
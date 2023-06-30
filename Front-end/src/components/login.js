import React from "react"
import { Button, Form, Input, Modal, message } from 'antd';
import { ajax } from "../utils/request";
import { saveToken } from "../utils/storage";
import { useTranslation } from "react-i18next";

export default function Login({ isOpen, setOpen, setRegisterOpen, setIsLogin }) {
  const {t} = useTranslation();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);


  const handleOk = () => {

    form.validateFields().then((values) => {
      console.log(values)
      setLoading(true);
      ajax.post("/user/login", values)
        .then(res => {
          let { data } = res;
          let { access_token } = data.data;
          saveToken(access_token);
          messageApi.open({
            type: "success",
            content: t("login.login_success"),
            duration: 3
          });
          setLoading(false);
          setOpen(false);
          form.resetFields();
          setIsLogin(true);
        })
        
        .catch(e => {
          messageApi.open({
            type: "error",
            content: t("login.login_failed"),
            duration: 3
          })
          setLoading(false);
          setOpen(false);
          form.resetFields();
        })
    });
  };


  function handleCancel() {
    console.log("handleCancel")
    setOpen(false);
  }

  return (
    <Modal
      name="basic"
      title={t("login.login")}
      centered={true}
      open={isOpen}
      footer={null}
      onCancel={handleCancel}
      width={450}
    >
      {contextHolder}
      <div className="mt-[25px]">
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            labelCol={{ span: 5 }}
            label={t("login.username")}
            name="username"
            rules={[
              { required: true, message: t("login.enter_username")},
            ]}
          >
            <Input placeholder={t("login.enter_username")} />
          </Form.Item>

          <Form.Item
            label="Password"
            labelCol={{ span: 5 }}
            name="password"
            rules={[
              { required: true, message: t("login.enter_password")},
            ]}
          >
            <Input.Password placeholder={t("login.enter_password")} />
          </Form.Item>

          <div className="login-link pl-[.5em] pb-[10px]">
            <span>{t("login.no_account")}</span>
            <a className="login cursor-pointer text-[var(--blue-text)] pl-[.5em] underline" onClick={()=> {
              setOpen(false);
              setRegisterOpen(true);
            }} href="#">{t("login.register")}</a>
          </div>

          <div className="flex flex-row items-center justify-center">
            <Button type="primary" htmlType="submit" loading={loading}>
              {t("login.login")}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 38 }}>
              {t("login.cancel")}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
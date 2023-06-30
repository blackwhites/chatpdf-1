import React from "react"
import { Button, Form, Input, Modal, message } from 'antd';
import { ajax } from "../utils/request";
import { saveToken } from "../utils/storage";
import { useTranslation } from "react-i18next";

export default function Register({ isOpen, setOpen, setLoginOpen }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const handleOk = () => {

    form.validateFields().then((values) => {
      console.log(values)
      setLoading(true);
      ajax.post("/user/signup", values)
        .then(res => {
          let { data } = res;
          let { access_token } = data.data;
          saveToken(access_token);
          messageApi.open({
            type: "success",
            content: t("signup.registerSuccess"),
            duration: 3
          });

          setLoading(false);
          setOpen(false);
          form.resetFields();
        })
        .catch(e => {
          messageApi.open({
            type: "error",
            content: t("signup.registerFail"),
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

  function validateUsername(_, v) {
    if (!v || !v.trim()) {
      return Promise.reject(t("signup.enterUsername"));
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{4,17}$/.test(v)) {
      return Promise.reject(t("signup.usernameRules"))
    }
    return ajax.get(`/user/existed/${v}`)
      .then(data => {
        if (data.data.data) {
          return Promise.reject(t("signup.usernameExists"));
        } else {
          return Promise.resolve();
        }
      })
  }
  return (
    <Modal
      name="basic"
      title={t("signup.registerUser")}
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
            label={t("signup.username")}
            name="username"
            rules={[
              { validator: validateUsername }
            ]}
          >
            <Input placeholder={t("signup.enterUsername")} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 5 }}
            label={t("signup.email")}
            name="email"
            rules={[
              { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: t("signup.invalidEmailFormat") },
              { required: true, message: t("signup.enterEmail") },
            ]}
          >
            <Input placeholder={t("signup.enterEmail")} />
          </Form.Item>
          <Form.Item
            label={t("signup.password")}
            labelCol={{ span: 5 }}
            name="password"
            rules={[
              { min: 6, message:  t("signup.passwordRules") },
              { max: 18, message:  t("signup.passwordRules") },
              { required: true, message: t("signup.enterPassword") },
            ]}
          >
            <Input.Password placeholder={ t("signup.enterPassword") } />
          </Form.Item>
          <div className="login-link pl-[.5em] pb-[10px]">
            <span>{ t("signup.haveAccount") }</span>
            <a className="login cursor-pointer text-[var(--blue-text)] pl-[.5em] underline" onClick={() => {
              setOpen(false);
              setLoginOpen(true);
            }} href="#">{ t("signup.login") }</a>
          </div>
          <div className="flex flex-row items-center justify-center">
            <Button type="primary" htmlType="submit" loading={loading}>
              { t("signup.register") }
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 38 }}>
              { t("signup.cancel") }
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Typography } from "antd";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginSuccessResponse } from "../common/interface";
import UserCtx from "../providers/user";
import message from "../common/message.json";

interface LoginProps {
  visible: boolean;
  onLogin: () => void;
  onCancel: () => void;
  destroyOnClose?: boolean;
}

(globalThis as any).ASYNC_VALIDATOR_NO_WARNING = 1;

function Login({ visible, onLogin, onCancel, destroyOnClose }: LoginProps) {
  const { dispatch } = useContext(UserCtx);
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [formAlert, setFormAlert] = useState<
    | { type: "success" | "info" | "warning" | "error"; message: string }
    | undefined
  >(undefined);

  const onFinish = (values: { id: string; password: string }) => {
    setSubmitting(true);
    axios
      .post<LoginSuccessResponse>("/api/login", {
        userId: values.id,
        password: values.password,
      })
      .then(({ data }) => {
        // localStorage.setItem("token", data.token);
        dispatch({
          type: "login",
          payload: { userId: values.id, isAdmin: data.isAdmin },
        });
        onLogin();

        setFormAlert(undefined);
        form.setFieldsValue({ id: form.getFieldValue("id"), password: "" });
      })
      .catch((err) => {
        setFormAlert({
          type: "error",
          message: err.response.data.error,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Modal
      title={message.loginTitle}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={destroyOnClose}
    >
      <Form name="login" form={form} onFinish={onFinish}>
        <Form.Item name="id" rules={[{ required: true }]}>
          <Input placeholder="id" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" prefix={<LockOutlined />} />
        </Form.Item>
        <Typography.Paragraph type="secondary" className="text-right">
          *{message.default123456}
        </Typography.Paragraph>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className="w-full"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      {formAlert && <Alert type={formAlert.type} message={formAlert.message} />}
    </Modal>
  );
}

export default Login;

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Typography } from "antd";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginResponse } from "../api/types";
import UserCtx from "../providers/user";

interface LoginProps {
  visible: boolean;
  onLogin: (token: string) => void;
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
    const userId = parseInt(values.id);
    setSubmitting(true);
    axios
      .post<LoginResponse>("/api/login", {
        userId: userId,
        password: values.password,
      })
      .then(({ data }) => {
        // localStorage.setItem("token", data.token);
        dispatch({
          type: "login",
          payload: { userId, isAdmin: data.isAdmin },
        });
        onLogin(data.token);

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
      title="Login to SCUT library"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={destroyOnClose}
    >
      <Form name="login" form={form} onFinish={onFinish}>
        <Form.Item
          name="id"
          rules={[
            { required: true },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                const userId = parseInt(value);
                if (isNaN(userId)) {
                  return Promise.reject("id should only contain numbers");
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input placeholder="id" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" prefix={<LockOutlined />} />
        </Form.Item>
        <Typography.Paragraph type="secondary" className="text-right">
          *Default password for students and staff is 123456
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

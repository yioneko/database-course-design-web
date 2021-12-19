import { Button, Form, Input, message as antdMessage } from "antd";
import { useUserPasswordMutation } from "../hooks/queries";
import message from "../common/message.json";

function PassowrdEdit({ userId }: { userId: string }) {
  const [form] = Form.useForm();
  const mutation = useUserPasswordMutation(userId);

  const onFinish = (values: { old: string; new: string }) => {
    mutation
      .mutateAsync({
        password: values.old,
        newPassword: values.new,
      })
      .then(() => {
        form.resetFields();
        antdMessage.success(message.pwdReset);
      })
      .catch((err) => {
        antdMessage.error(err.response.data.error);
      });
  };

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 10 }}>
      <Form.Item label="Old password" name="old" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="New password" name="new" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm password"
        name="confirm"
        dependencies={["new"]}
        rules={[
          { required: true },
          {
            validator: (_, value: string | undefined) =>
              !value || value === form.getFieldValue("new")
                ? Promise.resolve()
                : Promise.reject(message.pwdNotMatch),
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PassowrdEdit;

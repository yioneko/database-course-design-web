import { Button, Form, Input, message } from "antd";
import { useUserPasswordMutation } from "../hooks/queries";

function PassowrdEdit({ userId }: { userId: number }) {
  const [form] = Form.useForm();
  const mutation = useUserPasswordMutation(userId);

  const onFinish = (values: { old: string; new: string }) => {
    mutation
      .mutateAsync({
        password: values.old,
        newPassword: values.new,
      })
      .then(() => {
        message.success("Password reset successfully");
      })
      .catch((err) => {
        message.error(err.response.data.error);
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
                : Promise.reject("The two passwords do not match"),
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

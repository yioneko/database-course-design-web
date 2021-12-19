import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BookAddRequest, BookInfoResponse } from "../common/interface";

function BookAdd() {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  // NOTE: turn the input to controlled component
  const [isbnVal, setIsbnVal] = useState("");
  const { data } = useQuery(
    ["bookInfoTest", isbnVal],
    async () => {
      try {
        const response = await axios.get<BookInfoResponse>(
          `/api/books/${isbnVal}/info`
        );
        return response.data;
      } catch (error) {
        return undefined;
      }
    },
    {
      enabled: !!isbnVal,
      onSuccess: (data) => {
        if (data) {
          form.setFieldsValue({
            title: data.title,
            author: data.author,
          });
        }
      },
    }
  );

  const mutation = useMutation(
    (bookInfo: BookAddRequest) => {
      return axios.post<BookAddRequest>(`/api/books`, bookInfo);
    },
    {
      onSuccess: (data) => {
        form.resetFields();
        setIsbnVal("");
        // TODO: more invalidation
        queryClient.invalidateQueries(["bookInfo", data.request.isbn]);
        queryClient.invalidateQueries(["bookInfoTest", data.request.isbn]);
        queryClient.invalidateQueries("books");
        message.success("Book added");
      },
    }
  );

  return (
    <Form
      form={form}
      onValuesChange={(vals) => {
        // TODO: throttle?
        if (vals.isbn) {
          setIsbnVal(vals.isbn);
        }
      }}
      onFinish={(values) => {
        mutation.mutate(values);
      }}
    >
      <Form.Item label="ISBN" name="isbn" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input disabled={!!data} />
      </Form.Item>
      <Form.Item label="Author" name="author" rules={[{ required: true }]}>
        <Input disabled={!!data} />
      </Form.Item>
      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

export default BookAdd;

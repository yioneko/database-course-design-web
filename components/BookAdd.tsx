import { MinusSquareOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message as antdMessage } from "antd";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AUTHOR_SEPARATOR } from "../common/constants";
import { BookAddRequest, BookInfoSuccessResponse } from "../common/interface";
import message from "../common/message.json";

function BookAdd() {
  const [form] =
    Form.useForm<{ isbn: string; title: string; author: string[] }>();

  const queryClient = useQueryClient();
  // NOTE: turn the input to controlled component
  const [testIsbn, setTestIsbn] = useState("");
  const { data } = useQuery(
    ["bookInfo", testIsbn],
    async () => {
      try {
        const response = await axios.get<BookInfoSuccessResponse>(
          `/api/books/${testIsbn}/info`
        );
        return response.data;
      } catch (error) {
        // the error indicates that the book is not found
        return undefined;
      }
    },
    {
      enabled: !!testIsbn,
      onSuccess: (data) => {
        if (data) {
          form.setFieldsValue({
            title: data.title,
            author: data.author.split(AUTHOR_SEPARATOR),
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
        antdMessage.success(message.bookAdded);

        // NOTE: reset Form.List field will cause the disapperance of the whole list
        form.resetFields(["isbn", "title"]);
        form.setFieldsValue({ author: [""] });

        setTestIsbn("");

        // TODO: more invalidation
        queryClient.invalidateQueries(["bookInfo", data.request.isbn]);
        queryClient.invalidateQueries("books");
      },
    }
  );

  const bookExists = !!data;

  return (
    <Form
      form={form}
      labelAlign="left"
      onFinish={({ isbn, title, author }) => {
        mutation.mutate({ isbn, title, author: author.join(AUTHOR_SEPARATOR) });
      }}
    >
      <div className="pr-6">
        <Form.Item label="ISBN" name="isbn" rules={[{ required: true }]}>
          <Input
            // check whether the book exists on blur
            onBlur={(e) => {
              setTestIsbn(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input disabled={bookExists} />
        </Form.Item>
        <Form.List name="author">
          {(fields, { add, remove }) => {
            const labelSpan = 4;
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key} className="flex mb-2 relative">
                    <Form.Item
                      {...field}
                      labelCol={{ span: labelSpan }}
                      wrapperCol={
                        index !== 0 ? { offset: labelSpan } : undefined
                      }
                      className="flex-grow mb-0"
                      label={index === 0 ? "Author" : ""}
                      rules={[
                        { required: true, message: message.authorRequired },
                        {
                          validator: (_, value: string) => {
                            if (!!value && value.includes(",")) {
                              return Promise.reject(message.authorNoComma);
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <Input disabled={bookExists} />
                    </Form.Item>
                    {!data && fields.length > 1 ? (
                      <MinusSquareOutlined
                        className="text-lg text-pink-500 hover:text-pink-700 absolute -right-6 top-1 cursor-pointer"
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </div>
                ))}
                <Form.Item wrapperCol={{ offset: labelSpan }}>
                  <Button
                    type="dashed"
                    className="text-success"
                    block
                    onClick={() => {
                      add();
                    }}
                    disabled={bookExists}
                  >
                    <PlusOutlined />
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </div>
      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          {message.add}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default BookAdd;

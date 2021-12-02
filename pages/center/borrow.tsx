import { Button, message, Table, Typography } from "antd";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Transaction } from "../../api/types";
import { CenterLayout } from "../../components/Layout";
import UserCtx from "../../providers/user";

const Borrowed: NextPage = () => {
  const { userId } = useContext(UserCtx);

  const { data, isFetching } = useQuery(["borrow", userId], async () => {
    const res = await axios.get<Transaction[]>(`/api/user/${userId}/borrow`);
    return res.data;
  });

  if (userId === undefined) {
    message.error("You must login first");
    return <></>;
  }

  return (
    <CenterLayout>
      <Table<Transaction>
        loading={isFetching}
        dataSource={data}
        pagination={false}
        rowClassName={(record) => (record.returnDate ? "bg-gray-200" : "")}
        summary={(data) => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              Currently borrowed books:{" "}
              <Typography.Text className="text-info">
                {data.filter((v) => !v.returnDate).length}
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={2}>
              Total fine:{" "}
              <Typography.Text type="danger">
                {data.reduce((acc, cur) => acc + cur.fine, 0)}
              </Typography.Text>{" "}
              <Button
                type="primary"
                onClick={() => {
                  message.info("Coming soon");
                }}
              >
                Pay fine
              </Button>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      >
        <Table.Column<Transaction>
          title="Title"
          dataIndex="title"
          key="title"
          render={(_, { title, isbn }) => (
            <Link href={`/comment/${isbn}`}>
              <a className="text-info">{title}</a>
            </Link>
          )}
        />
        <Table.Column title="Author" dataIndex="author" key="author" />
        <Table.Column title="ISBN" dataIndex="isbn" key="isbn" />
        <Table.Column title="Borrow Date" dataIndex="date" key="date" />
        <Table.Column
          title="Due Date"
          dataIndex="dueDate"
          key="dueDate"
          className="text-warning"
        />
        <Table.Column<Transaction>
          title="Fine"
          dataIndex="fine"
          key="fine"
          onCell={({ fine }) => {
            if (fine === 0) {
              return {
                className: "text-green-500",
              };
            } else {
              return {
                className: "text-red-500",
              };
            }
          }}
        />
      </Table>
    </CenterLayout>
  );
};

export default Borrowed;

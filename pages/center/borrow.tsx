import { Button, message as antdMessage, Modal, Table, Typography } from "antd";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import {
  TransactionInfo,
  UserBorrowInfoSuccessResponse,
} from "../../common/interface";
import message from "../../common/message.json";
import { CenterLayout } from "../../components/Layout";
import PayFine from "../../components/PayFine";
import UserCtx from "../../providers/user";

function PayFineAction({ fine }: { fine: number }) {
  const [popup, setPopup] = useState(false);

  const onFinish = () => {
    setPopup(false);
    antdMessage.success(message.payFineSuccess);
  };

  return (
    <>
      <Modal
        visible={popup}
        footer={null}
        destroyOnClose
        title={message.payFine}
        onCancel={() => {
          setPopup(false);
        }}
      >
        <PayFine fine={fine} onFinish={onFinish} />
      </Modal>
      <Button
        type="primary"
        onClick={() => {
          setPopup(true);
        }}
      >
        {message.payFine}
      </Button>
    </>
  );
}

const Borrowed: NextPage = () => {
  const { userId } = useContext(UserCtx);
  const { data, isFetching } = useQuery(["borrow", userId], async () => {
    const res = await axios.get<UserBorrowInfoSuccessResponse>(
      `/api/user/${userId}/borrow`
    );
    return res.data;
  });

  return (
    <CenterLayout>
      <Table<TransactionInfo>
        loading={isFetching}
        dataSource={data?.transactions}
        pagination={false}
        rowKey={({ isbn, date }) => `${isbn}_${date}`}
        rowClassName={(record) => (record.returnDate ? "bg-gray-200" : "")}
        summary={(data) => {
          const totalFine = data.reduce((acc, cur) => acc + cur.fine, 0);

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                {message.borrowedBooks}
                {": "}
                <Typography.Text className="text-info">
                  {data.filter((v) => !v.returnDate).length}
                </Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                {message.totalFine}
                {": "}
                <Typography.Text type="danger">
                  {totalFine}
                </Typography.Text>{" "}
                <PayFineAction fine={totalFine} />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      >
        <Table.Column<TransactionInfo>
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
        <Table.Column title="Copy ID" dataIndex="copyId" key="copyId" />
        <Table.Column title="Borrow Date" dataIndex="date" key="date" />
        <Table.Column
          title="Due Date"
          dataIndex="dueDate"
          key="dueDate"
          className="text-warning"
        />
        <Table.Column<TransactionInfo>
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

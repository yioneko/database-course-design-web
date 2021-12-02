import { Table } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import { Transaction } from "../../api/types";
import { AdminLayout } from "../../components/Layout";
import { useMetaData } from "../../hooks/queries";

const TransactionsAdmin: NextPage = () => {
  const { data: metaData } = useMetaData();
  const [page, setPage] = useState(0);

  const { data, isFetching } = useQuery(["transactions", page], async () => {
    const response = await axios.get<Transaction[]>("/api/transactions", {
      params: {
        page,
      },
    });
    return response.data;
  });

  return (
    <AdminLayout>
      <Table
        dataSource={data}
        pagination={{
          total: metaData?.transactions.total,
          pageSize: data?.length,
        }}
        onChange={(pagination) => {
          setPage((pagination.current ?? 1) - 1);
        }}
        loading={isFetching}
      >
        <Table.Column title="Title" dataIndex="title" key="title" />
        <Table.Column title="Author" dataIndex="author" key="author" />
        <Table.Column title="ISBN" dataIndex="isbn" key="isbn" />
        <Table.Column title="User ID" dataIndex="userId" key="userId" />
        <Table.Column title="Date" dataIndex="date" key="date" />
        <Table.Column title="Due Date" dataIndex="dueDate" key="dueDate" />
        <Table.Column
          title="Return Date"
          dataIndex="returnDate"
          key="returnDate"
        />
        <Table.Column title="Fine" dataIndex="fine" key="fine" />
      </Table>
    </AdminLayout>
  );
};

export default TransactionsAdmin;

import { Table } from "antd";
import axios from "axios";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { TransactionListSuccessResponse } from "../../common/interface";
import { AdminLayout } from "../../components/Layout";
import usePaginationParams from "../../hooks/usePaginationParams";

const TransactionsAdmin: NextPage = () => {
  const { paginationParams, paginationConfig } = usePaginationParams();

  const { data, isFetching } = useQuery(
    ["transactions", paginationParams],
    async () => {
      const response = await axios.get<TransactionListSuccessResponse>(
        "/api/transactions",
        {
          params: paginationParams,
        }
      );
      return response.data;
    }
  );

  return (
    <AdminLayout>
      <Table
        dataSource={data?.transactions}
        pagination={paginationConfig(data?.pageCount)}
        loading={isFetching}
        rowKey={({ isbn, userId, date }) => `${isbn}_${userId}_${date}`}
      >
        <Table.Column title="Title" dataIndex="title" key="title" />
        <Table.Column title="Author" dataIndex="author" key="author" />
        <Table.Column title="ISBN" dataIndex="isbn" key="isbn" />
        <Table.Column title="Copy ID" dataIndex="copyId" key="copyId" />
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

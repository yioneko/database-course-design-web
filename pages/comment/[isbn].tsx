import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";
import CommentList, {
  getComments,
  initialPaginationParams,
} from "../../components/CommentList";
import CommentEdit, { getBookInfo } from "../../components/CommentEdit";
import { useContext } from "react";
import UserCtx from "../../providers/user";
import { Col, Descriptions, Divider, Row, Typography } from "antd";

export const getServerSideProps: GetServerSideProps<
  { [key: string]: any },
  { isbn: string }
> = async (context) => {
  const { isbn } = context.params as { isbn: string };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["comments", isbn], () =>
    getComments(isbn, initialPaginationParams)
  );
  await queryClient.prefetchQuery(["bookInfo", isbn], () => getBookInfo(isbn));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

// TODO: Fallback to 404 page for noexisting isbn
const CommentPage: NextPage = () => {
  const { userId } = useContext(UserCtx);

  const { isbn } = useRouter().query as { isbn: string };
  const { data } = useQuery(["bookInfo", isbn, userId], () =>
    getBookInfo(isbn, userId)
  );

  return (
    <div>
      <Head>
        <title>Comments - {data?.title}</title>
        <meta name="description" content={`Comments of ${data?.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row className="mx-auto max-w-screen-xl mt-4">
        <Col span={8}>
          <Descriptions
            title={
              <Typography.Title
                level={4}
                className="!text-blue-600 whitespace-normal"
              >
                {data?.title}
              </Typography.Title>
            }
            className="border-2 bg-purple-200 p-4 mr-6"
            column={{ xxl: 3, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Author">
              <Typography.Text strong>{data?.author}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="ISBN">
              <Typography.Text strong>{isbn}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Available">
              <Typography.Text strong>{data?.available}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={16}>
          <CommentEdit isbn={isbn} />
          <Divider />
          <CommentList isbn={isbn} />
        </Col>
      </Row>
    </div>
  );
};

export default CommentPage;

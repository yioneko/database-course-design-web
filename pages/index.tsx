import type { NextPage } from "next";
import Head from "next/head";
import BookList from "../components/BookList";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>SCUT Library</title>
        <meta name="description" content="Demo library system for SCUT" />
      </Head>

      <BookList />
    </div>
  );
};

export default Home;

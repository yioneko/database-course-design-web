import { ConfigProvider, Layout, message } from "antd";
import "antd/dist/antd.variable.min.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import Header from "../components/Header";
import UserCtx, { useUserCtxProvider } from "../providers/user";
import "../styles/globals.css";
import handleQueryError from "../utils/handleQueryError";

/*
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const { worker } = require("../mocks/browser");
  worker.start();
}
*/

const { Content } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  const userCtx = useUserCtxProvider();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            onError: (err) => handleQueryError(err, message.error),
          },
          mutations: {
            onError: (err) => handleQueryError(err, message.error),
          },
        },
      })
  );

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        // primaryColor: "#7A6C45",
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ConfigProvider>
          <UserCtx.Provider value={userCtx}>
            <Layout className="min-h-screen">
              <Header />
              <Content className="pt-4">
                <Component {...pageProps} />
              </Content>
            </Layout>
          </UserCtx.Provider>
        </ConfigProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;

import "antd/dist/antd.variable.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import UserCtx, { useUserCtxProvider } from "../providers/user";
import { ConfigProvider, Layout } from "antd";
import { useEffect, useState } from "react";
import Header from "../components/Header";

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const { worker } = require("../mocks/browser");
  worker.start();
}

const { Content } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  const userCtx = useUserCtxProvider();
  const [queryClient] = useState(() => new QueryClient());

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

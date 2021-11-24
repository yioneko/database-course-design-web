import { render, RenderOptions } from "@testing-library/react";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import UserCtx, { UserInfo, useUserCtxProvider } from "../providers/user";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity,
    },
  },
});

function Wrapper({
  children,
  defaultUser,
}: {
  children: React.ReactElement;
  defaultUser?: UserInfo;
}) {
  const userCtx = useUserCtxProvider();

  useEffect(() => {
    if (defaultUser) {
      userCtx.dispatch({ type: "login", payload: defaultUser });
    }
  }, [defaultUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserCtx.Provider value={userCtx}>{children}</UserCtx.Provider>
    </QueryClientProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: RenderOptions & { defaultUser?: UserInfo }
) {
  return render(ui, {
    wrapper: (props) => (
      <Wrapper defaultUser={options?.defaultUser} {...props} />
    ),
    ...options,
  });
}

export * from "@testing-library/react";
export { customRender as render };

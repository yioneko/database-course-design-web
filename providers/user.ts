import { NextRouter } from "next/router";
import { createContext, useReducer } from "react";

export interface UserInfo {
  userId: string | undefined;
  isAdmin: boolean;
}

type ReducerAction =
  | {
      type: "logout";
      router: NextRouter;
    }
  | {
      type: "login";
      payload: UserInfo;
    };

const UserCtx = createContext<
  UserInfo & { dispatch: React.Dispatch<ReducerAction> }
>(null!);

function reducer(state: UserInfo, action: ReducerAction) {
  switch (action.type) {
    case "logout":
      action.router.push("/");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return {
        userId: undefined,
        isAdmin: false,
      };
    case "login":
      return {
        userId: action.payload.userId,
        isAdmin: action.payload.isAdmin,
      };
    default:
      return state;
  }
}

export function useUserCtxProvider(initialUser?: UserInfo) {
  const { userId = undefined, isAdmin = false } = initialUser || {};
  const [state, dispatch] = useReducer(reducer, {
    userId: userId,
    isAdmin: isAdmin,
  });
  return {
    ...state,
    dispatch,
  };
}

export default UserCtx;

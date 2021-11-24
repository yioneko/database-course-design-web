import { createContext, useReducer } from "react";
import { NextRouter } from "next/router";

export interface UserInfo {
  userId: number | undefined;
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

export function useUserCtxProvider() {
  const [state, dispatch] = useReducer(reducer, {
    userId: undefined,
    isAdmin: false,
  });
  return {
    ...state,
    dispatch,
  };
}

export default UserCtx;

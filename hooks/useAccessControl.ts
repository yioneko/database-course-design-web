import { message as antdMessage } from "antd";
import { useRouter } from "next/router";
import { useContext, useLayoutEffect } from "react";
import UserCtx from "../providers/user";
import message from "../common/message.json";

function useAccessControl(requireAdmin: boolean = false) {
  const { userId, isAdmin } = useContext(UserCtx);
  const router = useRouter();

  // block rendering
  // FIXME: duplicate messages on logout
  useLayoutEffect(() => {
    if (userId === undefined) {
      antdMessage.error(message.mustLogin);
      router.push("/");
    } else if (requireAdmin && !isAdmin) {
      antdMessage.error(message.mustAdmin);
      router.push("/");
    }
  });
}

export default useAccessControl;

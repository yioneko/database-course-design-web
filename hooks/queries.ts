import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ModifyPasswordRequest,
  UserInfoSuccessResponse,
} from "../common/interface";
import UserCtx from "../providers/user";

export function useUserDetails(userId: string | undefined) {
  return useQuery(
    ["user", userId],
    async () => {
      const res = await axios.get<UserInfoSuccessResponse>(
        `/api/user/${userId}`
      );
      return { name: res.data.name };
    },
    {
      enabled: userId !== undefined,
    }
  );
}

export function useUserNameMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (name: string) => {
      return axios.post(`/api/user/${userId}`, { name });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", userId]);
      },
    }
  );
}

export function useUserPasswordMutation(userId: string) {
  const queryClient = useQueryClient();
  const { dispatch } = useContext(UserCtx);
  const router = useRouter();

  return useMutation(
    ({ password, newPassword }: ModifyPasswordRequest) => {
      return axios.post(`/api/user/${userId}`, { password, newPassword });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", userId]);
        dispatch({ type: "logout", router });
      },
    }
  );
}

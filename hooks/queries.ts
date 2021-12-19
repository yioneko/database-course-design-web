import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ModifyPasswordRequest,
  UserInfoSuccessResponse,
} from "../common/interface";

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

// TODO: Logout & redirect
export function useUserPasswordMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ password, newPassword }: ModifyPasswordRequest) => {
      return axios.post(`/api/user/${userId}`, { password, newPassword });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", userId]);
      },
    }
  );
}

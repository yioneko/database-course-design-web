import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MetaData, ModifyPasswordRequest, UserResponse } from "../api/types";

export function useUserDetails(userId: number | undefined) {
  return useQuery(
    ["user", userId],
    async () => {
      const res = await axios.get<UserResponse>(`/api/user/${userId}`);
      return { name: res.data.name };
    },
    {
      enabled: userId !== undefined,
    }
  );
}

export function useUserNameMutation(userId: number) {
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
export function useUserPasswordMutation(userId: number) {
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

export function useMetaData() {
  return useQuery(
    "meta",
    async () => {
      const res = await axios.get<MetaData>("/api/meta");
      return res.data;
    },
    {
      enabled: true,
    }
  );
}

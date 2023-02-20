import apiClient from "server/client";

export type Status = {
  id: number;
  name: string;
};

export const getAllStatus = async (): Promise<Array<Status>> => {
  try {
    const request = await apiClient.get<Array<Status>>("status/");

    return request.data;
  } catch (e) {
    throw e;
  }
};

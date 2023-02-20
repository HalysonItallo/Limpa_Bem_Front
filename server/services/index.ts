import apiClient from "server/client";

export type Service = {
  name: string;
  value: string;
  id: number;
  isAvaliable: boolean
};

export type ServiceDTO = Service;

export const getAllServices = async (): Promise<Array<Service>> => {
  try {
    const request = await apiClient.get<Array<Service>>("services/");

    return request.data;
  } catch (e) {
    throw e;
  }
};


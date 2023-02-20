import apiClient from "server/client";
import { CreateCustomerServiceDTO } from "./index";

export const createCustomerService = async (
  customerService: CreateCustomerServiceDTO
): Promise<boolean> => {
  try {
    const request = await apiClient.post("customer-service/", customerService);

    return request.data;
  } catch (e) {
    throw e;
  }
};

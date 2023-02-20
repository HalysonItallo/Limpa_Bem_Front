import apiClient from "server/client";
import { CreateCustomerServiceDTO } from "./index";

export const updateCustomerService = async (
  customerService: CreateCustomerServiceDTO
): Promise<boolean> => {
  try {
    const request = await apiClient.put(`customer-service/${customerService.id}/`, customerService);

    return request.data;
  } catch (e) {
    throw e;
  }
};
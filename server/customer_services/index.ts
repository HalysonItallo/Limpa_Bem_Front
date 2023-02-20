import apiClient from "server/client";
import { Status } from "server/status";
import { Service } from "../services";
import { Attendant, Helper, Client } from "../users";

export type CustomerService = {
  id: number;
  amount: string;
  type_payment: string;
  created_at: Date;
  will_carried_at: Date | string;
  service: Service;
  attendant?: Attendant;
  helper?: Helper;
  client: Client;
  status: Status;
};

export type CreateCustomerServiceDTO = Pick<
  CustomerService,
  "amount" | "type_payment" | "will_carried_at"
> & {
  service: number;
  client: number;
  attendant?: number;
  status?: number;
  helper?: number;
  id?: number;
};

export const getCustomerServices = async (): Promise<
  Array<CustomerService>
> => {
  try {
    const request = await apiClient.get<Array<CustomerService>>(
      `customer-service/`
    );

    return request.data;
  } catch (e) {
    throw e;
  }
};

export const getCustomerServicesById = async (
  id: number
): Promise<Array<CustomerService>> => {
  try {
    const customerServices = getCustomerServices();

    return (await customerServices).filter(({ client }) => client.id == id);
  } catch (e) {
    throw e;
  }
};

export const getPendingCustomerServices = async (): Promise<
  Array<CustomerService>
> => {
  try {
    const customerServices = getCustomerServices();

    return (await customerServices).filter(
      ({ status }) => status.name == "pendente"
    );
  } catch (e) {
    throw e;
  }
};

export const getFinishedCustomerServices = async (): Promise<
  Array<CustomerService>
> => {
  try {
    const customerServices = getCustomerServices();

    return (await customerServices).filter(
      ({ status }) => status.name == "realizado"
    );
  } catch (e) {
    throw e;
  }
};

export const getCustomerServiceById = async (
  id: number
): Promise<CustomerService> => {
  try {
    const request = await apiClient.get<CustomerService>(
      `customer-service/${id}`
    );

    return request.data;
  } catch (e) {
    throw e;
  }
};

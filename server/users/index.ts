import apiClient from "server/client";

const CLIENTE_GROUP_ID = 4;

export type User = {
  id: number;
  first_name: string;
  adress: string;
  cellphone: string;
  username: string;
  password: string;
  group_name: string;
};

export type Attendant = User;

export type Helper = User;

export type Client = User;

export type UserLoginDTO = Pick<User, "username" | "password">;

export type UserRegisterDTO = User;

type JWTToken = {
  token: string;
  user_id: number;
  group_name: string;
};

export const makeLogin = async ({
  username,
  password,
}: UserLoginDTO): Promise<JWTToken | undefined> => {
  try {
    const request = await apiClient.post<JWTToken>("login/", {
      username,
      password,
    });

    return request.data;
  } catch (e) {
    throw e;
  }
};

export const registerUser = async (user: UserRegisterDTO): Promise<boolean> => {
  try {
    const request = await apiClient.post<JWTToken>("persons/", {
      ...user,
      groups: [CLIENTE_GROUP_ID],
    });
    const wasRequestSucessfully = request?.data !== undefined;

    return wasRequestSucessfully;
  } catch (e) {
    throw e;
  }
};

export const getUserById = async (id: number) => {
  try {
    const request = await apiClient.get<User>(`persons/${id}`);

    return request.data;
  } catch (e) {
    throw e;
  }
};

export const getAllHelpers = async () => {
  try {
    const request = await apiClient.get<Array<User>>(`persons/`);

    return request.data.filter(({ group_name }) => group_name == "helper");
  } catch (e) {
    throw e;
  }
};

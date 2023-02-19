import apiClient from "server/client";

const CLIENTE_GROUP_ID = 1;

export type User = {
  name: string;
  address: string;
  cellphone: string;
  username: string;
  password: string;
  // group?
};

export type UserLoginDTO = Pick<User, "username" | "password">;
export type UserRegisterDTO = User;

type JWTToken = {
  token: string;
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
    const request = await apiClient.post<JWTToken>("register/", {
      ...user,
      group: CLIENTE_GROUP_ID,
    });
    const wasRequestSucessfully = request?.data !== undefined;

    return wasRequestSucessfully;
  } catch (e) {
    throw e;
  }

  return false;
};

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "server/client";
import Loading from "../Loading";
import { getUserById } from "../../../server/users";

export enum Permissions {
  Cliente = "cliente",
  Gerente = "gerente",
  Atendente = "atendente",
  Helper = "helper"
}

export type CommonAuthProps = {
  userGroupName: string;
  userId: number;
};

const withAuth = <T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<T>
) => {
  const WithAuth: React.FC<T> = (props: T) => {
    const router = useRouter();
    const [userGroupName, setUserGroupName] = useState<string>("");
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const userIdFromLocalStorage = localStorage.getItem("userId");

      if (!token) {
        router.push("/login");
      } else {
        apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;

        getUserById(Number(userIdFromLocalStorage))
          .then(({ group_name, id }) => {
            console.log("here", { group_name, id });
            setUserGroupName(group_name);
            setUserId(id);
            setIsReady(true);
          })
          .catch(console.error)
          .finally(() => {
            setIsLoading(false);
          });

        setIsLoading(false);
      }
    }, [router]);

    

    return (
      <>
        {isLoading ? (
          <Loading isLoading />
        ) : (
          isReady && (
            <WrappedComponent
              userGroupName={userGroupName}
              userId={userId}
              {...props}
            />
          )
        )}
      </>
    );
  };

  return WithAuth;
};

export default withAuth;

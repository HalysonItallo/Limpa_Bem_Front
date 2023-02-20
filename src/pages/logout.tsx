import { useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();

    router.push("/");
  }, [router]);

  return <Loading isLoading />;
};

export default Logout;

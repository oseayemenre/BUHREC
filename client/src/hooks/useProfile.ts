import { useEffect, useState } from "react";
import { TLoginResponseData, ILoginData } from "@/app/(auth)/auth/page";

export const useProfile = () => {
  const [profile, setProfile] = useState<ILoginData | null>();

  useEffect(() => {
    const handleFetchUser = async (): Promise<void> => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/profile", {
          method: "GET",
          credentials: "include",
        });
        const data = (await res.json()) as TLoginResponseData & ILoginData;

        setProfile(data);
      } catch (e) {
        console.log(e);
      }
    };

    handleFetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, setProfile };
};

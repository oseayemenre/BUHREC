"use client";

import { useAuthContext } from "@/context/auth.context";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const DashboardNav = () => {
  const router = useRouter();
  const { user, setUser } = useAuthContext();

  const handleLogout = async (): Promise<void> => {
    await fetch("http://localhost:8000/api/v1/auth/logout", {
      credentials: "include",
    });

    setUser(null);

    router.push("/");
  };

  const path = usePathname();

  return (
    <section className="w-[241px] bg-white flex flex-col items-center relative">
      <p className="font-[800] text-[20px] mt-6 mb-[120px]">
        <span className="text-[#4880FF]">BU</span>HREC
      </p>

      <Link
        href="/dashboard"
        className={`w-[192px] h-[50px] flex font-[500] justify-center items-center hover:bg-[#4880FF] hover:text-white ${
          path === "/dashboard" ? "bg-[#4880FF] text-white" : "text-black"
        } rounded-[6px] cursor-pointer mb-12`}
      >
        {user?.user.role === "RESEARCHER" ? "Upload document" : "Dashboard"}
      </Link>

      <Link
        href="/profile"
        className={`w-[192px] h-[50px] flex font-[500] justify-center hover:bg-[#4880FF] hover:text-white items-center  ${
          path === "/profile" ? "bg-[#4880FF] text-white" : "text-black"
        } rounded-[6px] cursor-pointer mb-12`}
      >
        Profile
      </Link>

      <p
        className="absolute bottom-[89px] cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </p>
    </section>
  );
};

export default DashboardNav;

"use client";

import DashboardNav from "@/components/dashboard-nav";
import { useAuthContext } from "@/context/auth.context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuPencilLine } from "react-icons/lu";

const Profile = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [password, setPassword] = useState("");

  if (!user || user?.message === "Token not found") return router.push("/auth");

  const handleSubmitProfile = async () => {};

  return (
    <main className="bg-[#F5F6FA] h-screen flex text-[14px]">
      <DashboardNav />
      <section className="w-[85%] flex items-center justify-center">
        <div className="w-[80%] h-[80%] bg-white rounded-[12px] p-20 relative">
          <div className="flex gap-x-5 items-center mb-4">
            {user.user.avatar ? (
              <div className="w-[100px] h-[100px] relative">
                <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer">
                  <input type="file" className="hidden" />
                  <LuPencilLine className="text-white" size={14} />
                </div>
                <Image
                  src={user.user.avatar}
                  width={100}
                  height={100}
                  className="rounded-full"
                  alt="avatar"
                />
              </div>
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-red-800 flex items-center justify-center text-white text-[36px] font-[700] relative">
                {user.user.lastname.charAt(0)}
                <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer">
                  <input type="file" className="hidden" />
                  <LuPencilLine className="text-white" size={14} />
                </div>
              </div>
            )}

            <div>
              <p className="text-[24px]">
                {user.user?.lastname} {user.user?.firstname}
              </p>
              <p className="text-[#6B7280] text-[18px]">{user.user.email}</p>
            </div>
          </div>

          <div className="w-full border-b-[#E5E7EB] border-b-[2px] mb-20" />

          <p className="text-[24px] mb-4">Update Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#E5E7EB] h-[40px] focus:outline-none px-3 rounded-[8px] mb-[100px]"
          />

          <div className="w-full flex justify-end">
            <button
              className="bg-[#4880FF] text-white w-[175px] h-[50px] rounded-[6px] text-[18px] font-[700]"
              onClick={handleSubmitProfile}
            >
              Save Change
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;

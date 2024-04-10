"use client";

import DashboardNav from "@/components/dashboard-nav";
import { useAuthContext } from "@/context/auth.context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(
    user?.user.avatar ? user.user.avatar : null
  );

  if (!user || user?.message === "Token not found") return router.push("/auth");

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = new FileReader();

    if (e.target.files) {
      file.readAsDataURL(e.target.files[0]);
    }

    file.onload = () => {
      setAvatar(file.result as string);
    };
  };

  const handleSubmitProfile = async () => {
    if (!avatar?.startsWith("https://res.cloudinary.com")) {
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/update-profile-picture",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: avatar,
          }),
        }
      );

      if (res.ok) return toast.success("Profile picture updated");

      return toast.error("Something went wrong, try again later");
    }

    if (password.length > 0) {
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/update-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password,
          }),
        }
      );

      if (res.ok) return toast.success("Password has been updated");
      return toast.error("Something went wrong, try again later");
    }

    if (
      password.length > 0 &&
      !avatar?.startsWith("https://res.cloudinary.com")
    ) {
      const res1 = await fetch(
        "http://localhost:8000/api/v1/auth/update-profile-picture",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            image: avatar,
          }),
        }
      );

      const res2 = await fetch(
        "http://localhost:8000/api/v1/auth/update-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password,
          }),
        }
      );

      if (res1.ok && res2.ok)
        return toast.success(
          "Profile picture and password has been succesfully updated"
        );

      return toast.error("Something went wrong, try again later");
    }
  };

  return (
    <main className="bg-[#F5F6FA] h-screen flex text-[14px]">
      <DashboardNav />
      <section className="w-[85%] flex items-center justify-center">
        <div className="w-[80%] h-[80%] bg-white rounded-[12px] p-20 relative">
          <div className="flex gap-x-5 items-center mb-4">
            {avatar ? (
              <div className="w-[100px] h-[100px] relative">
                <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    id="avatar"
                    onChange={(e) => handleChangeImage(e)}
                  />
                  <label htmlFor="avatar" className="cursor-pointer">
                    <LuPencilLine className="text-white" size={14} />
                  </label>
                </div>
                <div className="rounded-[50%] w-[100px] h-[100px] overflow-hidden border-[1px] flex items-center justify-center">
                  <Image
                    src={avatar as string}
                    width={100}
                    height={100}
                    alt=""
                  />
                </div>
              </div>
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-red-800 flex items-center justify-center text-white text-[36px] font-[700] relative">
                {user.user.lastname.charAt(0)}
                <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    id="avatarWithoutProfile"
                    onChange={(e) => handleChangeImage(e)}
                  />
                  <label
                    htmlFor="avatarWithoutProfile"
                    className="cursor-pointer"
                  >
                    <LuPencilLine className="text-white" size={14} />
                  </label>
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

"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineReplay } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa6";

const Dashboard = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/v1/auth/logout", {
      credentials: "include",
    });

    return router.push("/auth");
  };

  if (!user)
    return (
      <main className="flex justify-center items-center h-screen gap-x-6">
        <h2 className=" font-[800] text-[80px]">
          <span className="text-[#4880FF]">BU</span>
          HREC
        </h2>
        <motion.div
          animate={{
            rotate: 360,
            transition: {
              repeat: Infinity,
              duration: 1.5,
            },
          }}
        >
          <FaSpinner size={80} color="#4880FF" />
        </motion.div>
      </main>
    );

  if (user?.message === "Token not found") return router.push("/auth");

  console.log(user);

  return (
    <main className="bg-[#F5F6FA] h-screen flex text-[14px]">
      <section className="w-[241px] bg-white flex flex-col items-center relative">
        <p className="font-[800] text-[20px] mt-6 mb-[120px]">
          <span className="text-[#4880FF]">BU</span>HREC
        </p>

        <div className="w-[192px] h-[50px] flex font-[500] justify-center items-center text-white bg-[#4880FF] rounded-[6px] cursor-pointer">
          Dashboard
        </div>

        <p
          className="absolute bottom-[89px] cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </section>

      <section className="w-[85%]">
        <div className="h-[70px] w-full bg-white flex items-center pl-[78px] pr-[31px] justify-between">
          <div className="bg-[#F5F6FA] border-[#D5D5D5] rounded-[19px] border-[1px] w-[388px] h-[38px] flex items-center px-[16.55px] gap-x-[13.44px]">
            <HiMagnifyingGlass size={15} color="202224" />
            <input
              placeholder="Search"
              className="bg-transparent focus:outline-none w-full placeholder-[#202224]"
            />
          </div>
          <div className="flex items-center gap-x-6">
            <FaBell size={29} color="#4880FF" />
            {user?.user?.avatar ? (
              <Image
                src={user?.user.avatar as string}
                width={35}
                height={35}
                alt=""
                className="rounded-full"
              />
            ) : (
              <div className="w-[50px] h-[52px] bg-[#4880FF] rounded-full">
                {user?.user?.firstname.charAt(0)}
              </div>
            )}

            <div>
              <p className="font-[600]">
                {user?.user?.lastname} {user?.user?.firstname}
              </p>
              <p className="font-[500] text-[12px]">{user?.user?.role}</p>
            </div>
          </div>
        </div>

        <div className="mx-[30px]">
          <h1 className="mt-[30px] text-[32px] font-[600] mb-[23px]">
            {user?.user?.program}
          </h1>

          <div className="w-[685px] h-[70px] bg-white rounded-[10px] flex border-[1px] border-[#D5D5D5] mb-6">
            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <Image src="/filter.svg" width={19.5} height={22.5} alt="" />
            </div>

            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <p className="font-[600]">Filter By</p>
            </div>

            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <div className="flex items-center gap-x-6 ">
                <p className="font-[600]">Date</p>
                <IoIosArrowDown size={14} />
              </div>
            </div>

            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <div className="flex items-center gap-x-6 ">
                <p className="font-[600]">Type</p>
                <IoIosArrowDown size={14} />
              </div>
            </div>

            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <div className="flex items-center gap-x-6 ">
                <p className="font-[600]">Status</p>
                <IoIosArrowDown size={14} />
              </div>
            </div>

            <div className="p-6 flex items-center justify-center">
              <div className="flex items-center gap-x-2 ">
                <MdOutlineReplay size={18} color="#EA0234" />
                <p className="font-[600] text-[#EA0234]">Reset FIlter</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FCFDFD] w-full h-[49px] border-l-[#D5D5D5] border-l-[1px] border-r-[#D5D5D5] border-r-[1px] border-t-[#D5D5D5] border-t-[1px] flex items-center justify-between pl-[31px] pr-[78px] font-[700] text-[#202224]">
            <p>ID</p>
            <p>NAME</p>
            <p>COURSE</p>
            <p>DATE</p>
            <p>TYPE</p>
            <p>COURSE</p>
          </div>

          <div className="bg-white w-full p-6 border-[#D5D5D5] border-[1px] flex items-center justify-center">
            No documents yet
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

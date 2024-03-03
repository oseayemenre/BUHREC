"use client";

import Image from "next/image";
import Button from "./button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const nav_items = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Help",
      link: "/help",
    },
    {
      label: "About",
      link: "/about",
    },
    {
      label: "Submit a proposal",
      link: "/auth",
    },
    {
      label: "Main menu",
      link: "/main-menu",
    },
  ] as const;
  type Tnav_items = (typeof nav_items)[number];

  const router = useRouter();

  const [active, setActive] = useState<null | number>(null);

  return (
    <nav className="px-20 flex justify-between items-center mb-[90.27px]">
      <div className="flex gap-x-12 items-center font-[500]">
        <Link href="/">
          <Image src="/bu-logo-1.jpg" width={150} height={150} alt="" />
        </Link>

        {nav_items.map((items: Tnav_items, index: number) => {
          return (
            <div
              key={index}
              onMouseOver={() => setActive(index)}
              onMouseOut={() => setActive(null)}
              className="hover:text-[#EA580C] cursor-pointer font-[500] hover:duration-150 hover:ease tracking-[0.5px]"
            >
              <Link href={items.link}>{items.label}</Link>
              {active === index && (
                <div className="border-b-[#EA580C] border-b-[2px] w-full relative top-2 duration-150 ease" />
              )}
            </div>
          );
        })}
      </div>

      <Button
        style="w-[153px] h-[48px] rounded-[8px] font-[500] text-black text-[16px] border-black border-[3px] hover:text-[#EA580C] hover:border-[#EA580C] tracking-[0.5px]"
        text="Sign Up Now"
        handleSubmit={() => router.push("/auth")}
      />
    </nav>
  );
};

export default Navbar;

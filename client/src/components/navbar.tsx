"use client";

import Button from "./button";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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
  ] as const;
  type Tnav_items = (typeof nav_items)[number];

  const router = useRouter();

  const pathname = usePathname();

  const [active, setActive] = useState<null | number>(null);

  return (
    <nav className="px-20 flex justify-between items-center mb-[90.27px] py-12">
      <div className="flex gap-x-12 items-center font-[500]">
        <Link href="/">
          <h2 className=" font-[800] text-[20px]">
            <span className="text-[#4880FF]">BU</span>
            HREC
          </h2>
        </Link>

        {nav_items.map((items: Tnav_items, index: number) => {
          return (
            <div
              key={index}
              onMouseOver={() => setActive(index)}
              onMouseOut={() => setActive(null)}
              className={`hover:text-[#4880FF] cursor-pointer font-[500] hover:duration-150 hover:ease tracking-[0.5px] ${
                pathname === items.link ? "text-[#4880FF]" : "text-black"
              }`}
            >
              <Link href={items.link}>{items.label}</Link>
              {(active === index || pathname === items.link) && (
                <div className="border-b-[#4880FF] border-b-[2px] w-full relative top-2 duration-150 ease" />
              )}
            </div>
          );
        })}
      </div>

      <Button
        style="w-[153px] h-[48px] rounded-[8px] font-[500] text-black text-[16px] border-black border-[3px] hover:text-[#4880FF] hover:border-[#4880FF] tracking-[0.5px]"
        text="Sign Up Now"
        handleSubmit={() => router.push("/auth")}
      />
    </nav>
  );
};

export default Navbar;

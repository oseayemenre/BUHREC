"use client";

import Button from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const Home = () => {
  const nav_items = [
    {
      label: "Help",
      link: "#",
    },
    {
      label: "About",
      link: "#",
    },
    {
      label: "Submit a proposal",
      link: "#",
    },
    {
      label: "Main menu",
      link: "#",
    },
  ] as const;
  type Tnav_items = (typeof nav_items)[number];

  const router = useRouter();

  const [active, setActive] = useState<null | number>(null);

  return (
    <main>
      <nav className="px-20 flex justify-between items-center mb-[90.27px]">
        <Image src="/bu-logo-1.jpg" width={150} height={150} alt="" />
        <div className="flex gap-x-12 items-center font-[500]">
          {nav_items.map((items: Tnav_items, index: number) => {
            return (
              <div
                key={index}
                onMouseOver={() => setActive(index)}
                onMouseOut={() => setActive(null)}
                className="hover:text-[#EA580C] cursor-pointer"
              >
                <Link href={items.link}>{items.label}</Link>
                {active === index && (
                  <div className="border-b-[#EA580C] border-b-[2px] w-full relative top-2" />
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <section className="px-20 flex gap-x-20 items-center">
        <div className="w-1/2 flex flex-col gap-y-8 relative">
          <h1 className="font-[900] text-[72px] leading-[80px]">
            Review Projects easily
          </h1>
          <p className="text-[24px]">
            Amet nunc diam orci duis ut sit diam arcu, nec. Eleifend proin massa
            tincidunt viverra lectus pulvinar. Nunc ipsum est pellentesque
            turpis ultricies.
          </p>
          <Button
            style="w-[239px] h-[64px] bg-[#EA580C] rounded-[8px] font-[700] text-white text-[24px]"
            text="Sign Up Now"
            handleSubmit={() => router.push("/auth")}
          />
        </div>

        <Image src="/hero-image.svg" width={624.6} height={544.63} alt="" />
      </section>
    </main>
  );
};

export default Home;

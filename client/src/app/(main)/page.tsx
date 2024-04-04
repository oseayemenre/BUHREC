"use client";

import Button from "@/components/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";

const Home = () => {
  const router = useRouter();

  const { user, setUser } = useAuthContext();

  return (
    <main>
      <section className="px-20 flex gap-x-20 items-center">
        <div className="w-1/2 flex flex-col gap-y-8 relative">
          <h1 className="font-[900] text-[72px] leading-[80px]">
            Review Projects easily
          </h1>
          <p className="text-[20px]">
            Welcome to BUHREC, your go-to destination for streamlined document
            and project reviews. Designed with efficiency in mind, our site
            provides a user-friendly interface to facilitate collaborative and
            insightful evaluations of documents and projects.
          </p>
          <Button
            style="w-[239px] h-[64px] bg-[#4880FF] rounded-[8px] font-[700] text-white text-[24px] hover:text-[#4880FF] hover:bg-white hover:border-[#4880FF] hover:border-[3px] tracking-[0.5px]"
            text="Sign Up Now"
            handleSubmit={() => router.push("/auth")}
          />
        </div>

        <Image
          src="/hero-image.jpg"
          width={624.6}
          height={622.52}
          alt=""
          priority
        />
      </section>
    </main>
  );
};

export default Home;

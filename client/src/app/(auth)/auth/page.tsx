"use client";

import Image from "next/image";
import Button from "@/components/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  firstname: z
    .string({
      required_error: "Name cannot be empty",
    })
    .min(1),
  lastname: z
    .string({
      required_error: "Name cannot be empty",
    })
    .min(1),
  email: z
    .string({
      required_error: "Email cannot be empty",
    })
    .email()
    .min(1),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;

const App = () => {
  const [variant, setVariant] = useState(false);

  const form1 = useForm<TRegisterSchema>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
    },

    resolver: zodResolver(registerSchema),
  });

  const handleSubmit = async (values: TRegisterSchema) => {
    console.log("submitted");
    await fetch("http://localhost:8000/api/v1/auth/create-account", {
      method: "POST",
      body: JSON.stringify({
        firstName: values.firstname,
        email: values.email,
        lastName: values.lastname,
      }),
    });
  };

  return (
    <main className="bg-[url('/background-image.png')] h-screen bg-cover flex items-center justify-center">
      <div className="bg-[url('/transparent-background.png')] bg-cover rounded-[50px] w-[80%] pl-[104px] pt-[100px] pb-[130px] text-white">
        <Image
          src="/login-icon.png"
          width={43.27}
          height={50}
          alt=""
          className="mb-[63px]"
        />
        <p className="font-[600] text-[16px]">START HERE</p>
        <h1 className="font-[600] text-[56px] mb-[30px]">
          {variant ? "Sign In" : "Create new account"}
          <span className="text-[#1D90F4]">.</span>
        </h1>

        <section className="w-[478px] flex flex-col gap-y-5 mb-10">
          {!variant && (
            <div className="flex justify-between items-center">
              <div className=" bg-[#514B96] w-[229px] h-[46px] relative rounded-[4px] flex items-center">
                <input
                  {...form1.register("firstname")}
                  className="bg-transparent peer focus:outline-none ml-[18px] text-[12px] mt-2"
                  id="first-name"
                  placeholder=""
                />
                <label
                  className="absolute left-[18px] top-[7px] font-[300] text-[8px] peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[14px] duration-150 ease w-full"
                  htmlFor="first-name"
                >
                  First Name
                </label>
              </div>

              <div className=" bg-[#514B96] w-[229px] h-[46px] relative rounded-[4px] flex items-center">
                <input
                  {...form1.register("lastname")}
                  className="bg-transparent peer focus:outline-none ml-[18px] text-[12px] mt-2"
                  id="last-name"
                  placeholder=""
                />
                <label
                  className="absolute left-[18px] top-[7px] font-[300] text-[8px] peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[14px] duration-150 ease w-full"
                  htmlFor="last-name"
                >
                  Last Name
                </label>
              </div>
            </div>
          )}

          <div className=" bg-[#514B96] h-[46px] relative rounded-[4px] flex items-center">
            <input
              {...form1.register("email")}
              className="bg-transparent peer focus:outline-none ml-[18px] text-[12px] mt-2"
              id="email"
              placeholder=""
            />
            <label
              className="absolute left-[18px] top-[7px] font-[300] text-[8px] peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[14px] duration-150 ease w-full"
              htmlFor="email"
            >
              Email
            </label>
          </div>

          {variant && (
            <div className=" bg-[#514B96] h-[46px] relative rounded-[4px] flex items-center">
              <input
                className="bg-transparent peer focus:outline-none ml-[18px] text-[12px] mt-2"
                id="password"
                type="password"
                placeholder=""
              />
              <label
                className="absolute left-[18px] top-[7px] font-[300] text-[8px] peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[14px] duration-150 ease w-full"
                htmlFor="password"
              >
                Password
              </label>
            </div>
          )}
        </section>

        <Button
          style="w-[229px] h-[46px] rounded-[4px] bg-[#F47458] font-[600] mb-[30px] focus:outline-none"
          text={variant ? "Login" : "Create Account"}
          handleSubmit={form1.handleSubmit(handleSubmit)}
        />

        <p>
          {variant ? "Dont Have An Account? " : "Already A Member? "}
          <span
            className="text-[#F47458] cursor-pointer"
            onClick={() => setVariant(!variant)}
          >
            {variant ? "Create An Account" : "Log In"}
          </span>
        </p>
      </div>
    </main>
  );
};

export default App;

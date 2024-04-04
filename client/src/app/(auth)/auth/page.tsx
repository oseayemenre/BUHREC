"use client";

import { IoIosArrowDown } from "react-icons/io";
import Button from "@/components/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth.context";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa6";

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

const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username cannot be empty",
    })
    .min(1),
  password: z
    .string({
      required_error: "Password cannot be empty",
    })
    .min(1),
});

const userRole = [
  "Researcher",
  "Reviewer",
  "Admin",
  "Sub admin",
  "Role",
] as const;

const userLevel = ["Undergraduate", "PgD", "MsC", "PhD", "Level"] as const;

const userProgram = [
  "Computer Science",
  "Environmental Science",
  "Science",
  "Health",
  "Management",
  "Humanities",
  "Programs",
] as const;

interface IErrorData {
  message: string;
  stackTrace: string;
  status: string;
}

export interface ILoginDatadata {
  avatar?: string;
  createdAt: Date;
  email: string;
  firstname: string;
  message: string;
  id: string;
  lastname: string;
  level: "UNDERGRADUATE" | "PGD" | "MSC" | "PHD";
  password: string;
  program:
    | "COMPUTER_SCIENCE"
    | "ENVIRONMENTAL_SCIENCE"
    | "SCIENCE"
    | "HEALTH"
    | "MANAGEMENT"
    | "HUMANITIES";
  role: "ADMIN" | "SUB_ADMIN" | "REVIEWER" | "RESEARCHER";
  updatedAt: Date;
  username: string;
}

export interface ILoginData {
  status: string;
  message: string;
  accessToken: string;
  data: ILoginDatadata;
  user: ILoginDatadata;
}

type TRegisterSchema = z.infer<typeof registerSchema>;
type TLoginSchema = z.infer<typeof loginSchema>;
type TRole = (typeof userRole)[number];
type TLevel = (typeof userLevel)[number];
type TProgram = (typeof userProgram)[number];
export type TLoginResponseData = IErrorData & ILoginData;

const App = () => {
  const [variant, setVariant] = useState(false);
  const [role, setRole] = useState<TRole>("Role");
  const [level, setLevel] = useState<TLevel>("Level");
  const [program, setProgram] = useState<TProgram>("Programs");
  const [roleToggle, setRoleToggle] = useState(false);
  const [levelToggle, setLevelToggle] = useState(false);
  const [programToggle, setProgramToggle] = useState(false);

  const router = useRouter();

  const form1 = useForm<TRegisterSchema>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
    },

    resolver: zodResolver(registerSchema),
  });

  const form2 = useForm<TLoginSchema>({
    defaultValues: {
      username: "",
      password: "",
    },

    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = async (
    values: TRegisterSchema
  ): Promise<string | void> => {
    if (role === "Role" || level === "Level" || program === "Programs") {
      return toast.error("User cannot be created");
    }

    const res = await fetch(
      "http://localhost:8000/api/v1/auth/create-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          role: role.toUpperCase().split(/\s+/).join("_"),
          level: level.toUpperCase(),
          program: program.toUpperCase().split(/\s+/).join("_"),
        }),
      }
    );

    const data = (await res.json()) as TLoginResponseData;

    if (res.status === 409) return toast.error("User already exists");

    if (data.message === "Admin already exists")
      return toast.error("Admin already exists");

    if (data.message === "A sub-admin for this course already exists")
      return toast.error("A sub-admin for this course already exists");

    if (res.status === 500) return toast.error("Oops! Something went wrong");

    //@ts-ignore
    setUser(data);

    return router.push("/dashboard");
  };

  const loginSubmit = async (values: TLoginSchema): Promise<void | string> => {
    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    if (!res.ok) return toast.error("Invalid credentials");

    const data = (await res.json()) as ILoginData;

    //@ts-ignore
    setUser(data);

    return router.push("/dashboard");
  };

  useEffect(() => {
    if (
      form1.formState.errors.email ||
      form1.formState.errors.lastname ||
      form1.formState.errors.firstname
    ) {
      toast.error("User cannot be created");
    }
  }, [
    form1.formState.errors.email,
    form1.formState.errors.lastname,
    form1.formState.errors.firstname,
  ]);

  useEffect(() => {
    if (form2.formState.errors.username || form2.formState.errors.password) {
      toast.error("Email or password cannot be empty");
    }
  }, [form2.formState.errors.username, form2.formState.errors.password]);

  const { user, setUser } = useAuthContext();

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

  if (user?.status === "success") return router.push("/dashboard");

  return (
    <main className="bg-[url('/background-image.png')] h-screen bg-cover flex items-center justify-center overflow-y-hidden">
      <div className="bg-[url('/transparent-background.png')] bg-cover rounded-[50px] w-[80%] px-[104px] h-[592px] text-white flex justify-evenly items-center">
        <section className="relative top-6">
          <h2 className=" font-[800] text-[20px]">
            <span className="text-[#4880FF]">BU</span>
            HREC
          </h2>
          <h1 className="font-[700] text-[56px] mb-[30px]">
            {variant ? "Sign In" : "Create new account"}
            <span className="text-[#4880FF]">.</span>
          </h1>

          <section className="w-[478px] mb-10">
            {!variant && (
              <form
                className="flex flex-col gap-y-5"
                onSubmit={form1.handleSubmit(handleSubmit)}
              >
                <div className="flex justify-between items-center">
                  <div className=" bg-[#514B96] w-[229px] h-[46px] relative rounded-[4px] flex items-center">
                    <input
                      {...form1.register("firstname")}
                      className="bg-transparent peer focus:outline-none mx-[18px] text-[12px] mt-2 w-full"
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
                      className="bg-transparent peer focus:outline-none mx-[18px] text-[12px] mt-2 w-full"
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

                <div className="flex justify-between items-center">
                  <div className=" bg-[#514B96] w-[229px] h-[46px] relative rounded-[4px] flex items-center">
                    <input
                      {...form1.register("email")}
                      className="bg-transparent peer focus:outline-none mx-[18px] text-[12px] mt-2 w-full"
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

                  <div
                    className=" bg-[#514B96] w-[229px] px-[18px] py-[14px] h-[46px] relative rounded-[4px] flex items-center cursor-pointer justify-between"
                    onClick={() => setRoleToggle(!roleToggle)}
                  >
                    <div className="font-[300] text-[14px]">{role}</div>
                    <IoIosArrowDown
                      color="white"
                      className={`duration-150 ease ${
                        roleToggle ? "-rotate-180" : "rotate-0"
                      }`}
                    />

                    {roleToggle && (
                      <div className="bg-[#6c4cdf] w-[229px] h-[215px] absolute text-[14px] font-[600] z-10 top-[52px] left-0 rounded-[4px]">
                        {userRole.slice(0, 4).map((role, index: number) => (
                          <div key={index}>
                            <div
                              className="text-white px-4 hover:bg-[#4880FF] py-4 hover:text-white"
                              onClick={() => setRole(role)}
                            >
                              {role}
                            </div>

                            <div className="border-b-[1px] w-full border-white" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div
                    className=" bg-[#514B96] w-[229px] px-[18px] py-[14px] h-[46px] relative rounded-[4px] flex items-center cursor-pointer justify-between"
                    onClick={() => setLevelToggle(!levelToggle)}
                  >
                    <div className="font-[300] text-[14px]">{level}</div>
                    <IoIosArrowDown
                      color="white"
                      className={`duration-150 ease ${
                        levelToggle ? "-rotate-180" : "rotate-0"
                      }`}
                    />

                    {levelToggle && (
                      <div className="bg-[#6c4cdf] w-[229px] h-[215px] absolute text-[14px] font-[600] z-10 top-[52px] left-0 rounded-[4px]">
                        {userLevel.slice(0, 4).map((level, index: number) => (
                          <div key={index}>
                            <div
                              className="text-white px-4 hover:bg-[#4880FF] py-4 hover:text-white"
                              onClick={() => setLevel(level)}
                            >
                              {level}
                            </div>

                            <div className="border-b-[1px] w-full border-white" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className=" bg-[#514B96] w-[229px] px-[18px] py-[14px] h-[46px] relative rounded-[4px] flex items-center cursor-pointer justify-between"
                    onClick={() => setProgramToggle(!programToggle)}
                  >
                    <div className="font-[300] text-[14px]">{program}</div>
                    <IoIosArrowDown
                      color="white"
                      className={`duration-150 ease ${
                        programToggle ? "-rotate-180" : "rotate-0"
                      }`}
                    />

                    {programToggle && (
                      <div className="bg-[#6c4cdf] w-[229px] h-[215px] absolute text-[14px] font-[600] z-10 top-[52px] left-0 rounded-[4px]">
                        {userProgram
                          .slice(0, 4)
                          .map((program, index: number) => (
                            <div key={index}>
                              <div
                                className="text-white px-4 hover:bg-[#4880FF] py-4 hover:text-white"
                                onClick={() => setProgram(program)}
                              >
                                {program}
                              </div>

                              <div className="border-b-[1px] w-full border-white" />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}

            {variant && (
              <form
                className="flex flex-col gap-y-5"
                onSubmit={() => form2.handleSubmit(loginSubmit)}
              >
                <div className=" bg-[#514B96] h-[46px] relative rounded-[4px] flex items-center">
                  <input
                    {...form2.register("username")}
                    className="bg-transparent peer focus:outline-none mx-[18px] text-[12px] mt-2 w-full"
                    id="username"
                    placeholder=""
                  />
                  <label
                    className="absolute left-[18px] top-[7px] font-[300] text-[8px] peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-[14px] duration-150 ease w-full"
                    htmlFor="username"
                  >
                    Username
                  </label>
                </div>

                <div className=" bg-[#514B96] h-[46px] relative rounded-[4px] flex items-center">
                  <input
                    {...form2.register("password")}
                    className="bg-transparent peer focus:outline-none mx-[18px] text-[12px] mt-2 w-full"
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
              </form>
            )}
          </section>
        </section>

        <section className="relative top-12 flex flex-col items-center">
          <Button
            style="w-[300px] h-[46px] rounded-[4px] bg-[#4880FF] text-white font-[700] tracking-[0.05rem] font-[600] mb-[30px] focus:outline-none"
            text={variant ? "Login" : "Create Account"}
            handleSubmit={
              variant
                ? form2.handleSubmit(loginSubmit)
                : form1.handleSubmit(handleSubmit)
            }
          />

          <p>
            {variant ? "Dont Have An Account? " : "Already A Member? "}
            <span
              className="text-[#4880FF] cursor-pointer"
              onClick={() => setVariant(!variant)}
            >
              {variant ? "Create An Account" : "Log In"}
            </span>
          </p>
        </section>
      </div>
    </main>
  );
};

export default App;

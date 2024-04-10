"use client";

import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineReplay, MdOutlineFileDownload } from "react-icons/md";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";
import { ILoginDatadata } from "@/app/(auth)/auth/page";
import DashboardNav from "@/components/dashboard-nav";
import { Hind, Poppins } from "next/font/google";
import { toast } from "react-hot-toast";

const hind = Hind({ subsets: ["latin"], weight: ["500"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500"] });

interface IDocument {
  id: string;
  name: string;
  status: "APPROVED" | "PENDING";
  documentUrl: string;
  reviewerId?: string;
  dateAssigned: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IDocuments {
  documents: {
    document: IDocument[];
  }[];
}

interface ISubAdmins {
  sub_admins: ILoginDatadata[];
}

const Dashboard = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState<{ document: IDocument[] }[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<
    { document: IDocument[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [toggleDate, setToggleDate] = useState(false);
  const [toggleName, setToggleName] = useState(false);
  const [subAdmins, setSubAdmins] = useState<ILoginDatadata[]>([]);
  const [filteredSubAdmins, setFIlteredSubAdmins] =
    useState<ILoginDatadata[]>();
  const [upload, setUpload] = useState<string>();
  const [uploadName, setUploadName] = useState<string>();
  const [uploadSize, setUploadSize] = useState<number>();
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const { user } = useAuthContext();

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>
  ): void | string => {
    const file = new FileReader();

    if (e.target.files) {
      if (e.target.files[0].type !== "application/pdf")
        return toast.error("Document can only be pdf");
      setUploadName(e.target.files[0].name);
      setUploadSize(e.target.files[0].size / 1000000);

      file.readAsDataURL(e.target.files[0]);

      file.onload = () => {
        setUpload(file.result as string);
      };
    }
  };

  useEffect(() => {
    const count = [20, 40, 60, 80, 100];
    let i = 0;

    setUploadComplete(false);
    const increaseProgress = setInterval(() => {
      if (i < count.length) {
        setProgress(count[i]);

        if (count[i] === 100) {
          setUploadComplete(true);
        }

        i++;
      } else {
        clearInterval(increaseProgress);
      }
    }, 250);

    return () => clearInterval(increaseProgress);
  }, [uploadName, uploadSize]);

  useEffect(() => {
    const handleGetDocuments = async () => {
      setLoading(true);
      const res = await fetch(
        user?.user.role === "SUB_ADMIN"
          ? `http://localhost:8000/api/v1/document/program/${user?.user.program}`
          : user?.user.role === "ADMIN"
          ? "http://localhost:8000/api/v1/auth/sub-admins"
          : "",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = (await res.json()) as IDocuments & ISubAdmins;

      if (user?.user.role === "SUB_ADMIN") {
        setDocuments(data.documents);
        setFilteredDocuments(data.documents);
      }

      if (user?.user.role === "ADMIN") {
        setSubAdmins(data.sub_admins);
        setFIlteredSubAdmins(data.sub_admins);
      }

      setLoading(false);
    };

    handleGetDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitDocument = async () => {
    const res = await fetch(
      "http://localhost:8000/api/v1/document/upload-document",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          name:
            uploadName?.charAt(0).toUpperCase() +
            (uploadName as string)
              .slice(1)
              .replace("_", "")
              .replace(".pdf", "")
              .toLowerCase(),
          document: upload,
        }),
      }
    );

    if (res.status === 409)
      return toast.error("A document has already been submitted");
    if (res.status === 500) return toast.error("Something went wrong");

    return toast.success("Document uploaded succesfully");
  };

  if (user?.user.role === "RESEARCHER") {
    return (
      <main className="bg-[#F5F6FA] h-screen flex text-[14px]">
        <DashboardNav />
        <input
          type="file"
          id="file_upload"
          hidden
          onChange={handleFileUpload}
          accept=".pdf"
        />
        <div className="w-[85%] flex flex-col justify-start pt-6 items-center">
          <label
            htmlFor="file_upload"
            className={`w-[95%] border-dashed border-[2px] border-[#CACACA] h-[40%] rounded-[6px] flex flex-col items-center justify-center text-[24px] ${hind.className} cursor-pointer mb-20`}
          >
            <div className="bg-[#F5F5F5] w-[100px] h-[100px] rounded-full mx-auto flex items-center justify-center mb-4">
              <Image
                src="/document-upload.svg"
                width={60}
                height={60}
                alt="file-upload"
              />
            </div>

            <p className="mb-4">
              <span className="text-[#A020F0]">Click to Upload</span> or drag
              and drop
            </p>

            <p>(Max. File size: 25 MB)</p>
          </label>

          {uploadName && uploadName?.length > 0 && (
            <div
              className={`w-[328px] bg-white border-[2px] rounded-[6px] pt-4 px-4 pb-8 ${poppins.className} mb-20`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-start gap-x-5">
                  <Image
                    src="/document-text.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <div>
                    <p className="font-[500]">{uploadName}</p>
                    <p className="text-[12px] text-[#989692]">
                      {uploadSize?.toFixed(3)}MB
                    </p>
                  </div>
                </div>

                <Image
                  src={uploadComplete ? "/tick-circle.svg" : "/trash.svg"}
                  width={20}
                  height={20}
                  className={uploadComplete ? "" : "cursor-pointer"}
                  alt=""
                  onClick={
                    uploadComplete ? () => {} : () => setUploadName(undefined)
                  }
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="bg-[#F5F5F5] w-[259px] h-[6px] rounded-[4px]">
                  <div
                    className={`${
                      uploadComplete ? "bg-[#50C878]" : "bg-[#A020F0]"
                    } w-[${progress}%] h-full rounded-[4px]`}
                  />
                </div>
                <p className="text-[12px]">{progress}%</p>
              </div>
            </div>
          )}

          <button
            className={`${
              upload ? "bg-[#A020F0]" : "bg-[#d6b3ec]"
            } w-[250px] py-3 text-white ${poppins.className} rounded-[6px]`}
            onClick={handleSubmitDocument}
            disabled={upload ? false : true}
          >
            Upload
          </button>
        </div>
      </main>
    );
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const userQuery = e.target.value;

    if (user?.user.role === "SUB_ADMIN") {
      if (filteredDocuments) {
        const documents = filteredDocuments.filter((document) =>
          document.document[0].name
            .toLowerCase()
            .includes(userQuery.toLowerCase())
        );

        setFilteredDocuments(documents);
      }

      setQuery(userQuery);

      if (userQuery.length < 1) setFilteredDocuments(documents);
    }

    if (user?.user.role === "ADMIN") {
      if (filteredSubAdmins) {
        const subAdmin = filteredSubAdmins.filter((subAdmin) =>
          `${subAdmin.lastname} ${subAdmin.firstname}`
            .toLowerCase()
            .includes(userQuery.toLowerCase())
        );

        setFIlteredSubAdmins(subAdmin);
      }

      setQuery(userQuery);

      if (userQuery.length < 1) setFIlteredSubAdmins(subAdmins);
    }
  };

  const sortDate = (): void => {
    if (user?.user.role === "SUB_ADMIN") {
      const newArr = [...documents];

      newArr.sort((a, b) => {
        const dateA = new Date(a.document[0].createdAt);
        const dateB = new Date(b.document[0].createdAt);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        return 0;
      });

      setFilteredDocuments(newArr);
    }

    if (user?.user.role === "ADMIN") {
      const newArr = [...subAdmins];

      newArr.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;

        return 0;
      });

      setFIlteredSubAdmins(newArr);
    }
  };

  const sortNameDescending = (): void => {
    if (user?.user.role === "SUB_ADMIN") {
      const newArr = [...documents];

      newArr.sort((a, b) =>
        b.document[0].name.toLowerCase() < a.document[0].name.toLowerCase()
          ? -1
          : 1
      );

      setFilteredDocuments(newArr);
    }

    if (user?.user.role === "ADMIN") {
      const newArr = [...subAdmins];

      newArr.sort((a, b) =>
        b.lastname.toLowerCase() < a.lastname.toLowerCase() ? -1 : 1
      );

      setFIlteredSubAdmins(newArr);
    }
  };

  if (!user || user?.message === "Token not found") return router.push("/auth");

  if (loading)
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

  const header = ["ID", "NAME", "COURSE", "DATE", "DOCUMENT", "COURSE"];
  const adminHeader = ["ID", "USERNAME", "NAME", "EMAIL", "PROGRAM", "JOINED"];

  return (
    <main className="bg-[#F5F6FA] h-screen flex text-[14px]">
      <DashboardNav />
      <section className="w-[85%]">
        <div className="h-[70px] w-full bg-white flex items-center pl-[78px] pr-[31px] justify-between">
          <div className="bg-[#F5F6FA] border-[#D5D5D5] rounded-[19px] border-[1px] w-[388px] h-[38px] flex items-center px-[16.55px] gap-x-[13.44px]">
            <HiMagnifyingGlass size={15} color="202224" />
            <input
              placeholder="Search"
              className="bg-transparent focus:outline-none w-full placeholder-[#202224]"
              value={query}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-x-6">
            <FaBell size={29} color="#4880FF" />
            {user?.user.avatar ? (
              <div className="rounded-[50%] w-[55px] h-[50px] overflow-hidden border-[1px] flex items-center justify-center">
                <Image
                  src={user.user?.avatar as string}
                  width={55}
                  height={150}
                  alt=""
                />
              </div>
            ) : (
              <div className="w-[50px] h-[52px] bg-red-800 rounded-full flex items-center justify-center text-white text-[16px]">
                {user?.user?.lastname.charAt(0)}
              </div>
            )}

            <div>
              <p className="font-[600]">
                {user?.user.lastname} {user?.user.firstname}
              </p>
              <p className="font-[500] text-[12px]">
                {user?.user?.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-[30px]">
          <h1 className="mt-[30px] text-[32px] font-[700] mb-[23px]">
            {user.user.role === "SUB_ADMIN"
              ? user?.user.program.replace("_", " ")
              : user.user.role === "ADMIN"
              ? "SUB ADMINS"
              : ""}
          </h1>

          <div
            className={`${
              user.user.role === "SUB_ADMIN" ? "w-[700px]" : "w-[600px]"
            } h-[70px] bg-white rounded-[10px] flex border-[1px] border-[#D5D5D5] mb-6`}
          >
            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <Image src="/filter.svg" width={19.5} height={22.5} alt="" />
            </div>
            <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px]">
              <p className="font-[600]">Filter By</p>
            </div>
            <div
              className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px] relative"
              onClick={() => setToggleDate(!toggleDate)}
            >
              <div className="flex items-center gap-x-6 cursor-pointer">
                <p className="font-[600]">Date</p>
                <IoIosArrowDown size={14} />
              </div>

              {toggleDate && (
                <div className="bg-white border-[1px] border-[#D5D5D5] absolute w-full h-[90px] top-[68px] rounded-[2px] flex flex-col duration-150 ease transition">
                  <div
                    className="pt-3 hover:bg-[#4880FF] flex justify-center pb-2 cursor-pointer hover:text-white"
                    onClick={() => {
                      user.user.role === "ADMIN"
                        ? setFIlteredSubAdmins(subAdmins)
                        : null;
                    }}
                  >
                    <p>Ascending</p>
                  </div>
                  <div
                    className="pt-3 hover:bg-[#4880FF] flex justify-center pb-2 cursor-pointer hover:text-white"
                    onClick={
                      user.user.role === "SUB_ADMIN"
                        ? () => setFilteredDocuments(documents)
                        : sortDate
                    }
                  >
                    <p>Descending</p>
                  </div>
                </div>
              )}
            </div>

            <div
              className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px] relative"
              onClick={() => setToggleName(!toggleName)}
            >
              <div className="flex items-center gap-x-6 cursor-pointer">
                <p className="font-[600]">Name</p>
                <IoIosArrowDown size={14} />
              </div>

              {toggleName && (
                <div className="bg-white border-[1px] border-[#D5D5D5] absolute w-full h-[90px] top-[68px] rounded-[2px] flex flex-col duration-150 ease transition">
                  <div
                    className="pt-3 hover:bg-[#4880FF] flex justify-center pb-2 cursor-pointer hover:text-white"
                    onClick={() => {
                      user.user.role === "SUB_ADMIN"
                        ? setFilteredDocuments(documents)
                        : user.user.role === "ADMIN"
                        ? setFIlteredSubAdmins(subAdmins)
                        : null;
                    }}
                  >
                    <p>Ascending</p>
                  </div>
                  <div
                    className="pt-3 hover:bg-[#4880FF] flex justify-center pb-2 cursor-pointer hover:text-white"
                    onClick={sortNameDescending}
                  >
                    <p>Descending</p>
                  </div>
                </div>
              )}
            </div>
            {user.user.role === "SUB_ADMIN" && (
              <div className="p-6 flex items-center justify-center border-r-[#D5D5D5] border-r-[1px] relative">
                <div className="flex items-center gap-x-6 ">
                  <p className="font-[600]">Status</p>
                  <IoIosArrowDown size={14} />
                </div>
              </div>
            )}
            <div
              className="p-6 flex items-center justify-center cursor-pointer"
              onClick={() => setFIlteredSubAdmins(subAdmins)}
            >
              <div className="flex items-center gap-x-2 ">
                <MdOutlineReplay size={18} color="#EA0234" />
                <p className="font-[600] text-[#EA0234]">Reset FIlter</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FCFDFD] w-full h-[49px] border-l-[#D5D5D5] border-l-[1px] border-r-[#D5D5D5] border-r-[1px] border-t-[#D5D5D5] border-t-[1px] flex items-center gap-x-[115px] pl-[31px] pr-[78px] font-[700] text-[#202224]">
            {(user.user.role === "SUB_ADMIN" ? header : adminHeader).map(
              (title, index) => (
                <div key={index}>
                  <p className="w-[100px] text-center">{title}</p>
                </div>
              )
            )}
          </div>

          {user.user.role === "SUB_ADMIN" ? (
            <div
              className={`bg-white w-full p-6 border-t-[#D5D5D5] border-l-[#D5D5D5] border-r-[#D5D5D5] border-[1px] flex items-center ${
                documents && documents?.length < 1
                  ? "justify-center"
                  : "flex-col gap-y-6 pl-[31px] pr-[78px]"
              }`}
            >
              {documents && documents?.length < 1 ? (
                <p>No documents yet</p>
              ) : filteredDocuments && filteredDocuments.length < 1 ? (
                <p>No results found</p>
              ) : (
                filteredDocuments.map((document, index) => (
                  <div
                    className="w-full flex gap-x-[115px] items-center text-left"
                    key={index}
                  >
                    <div>
                      <p className="text-center w-[100px]">
                        {index < 9 ? `000${index + 1}` : `00${index + 1}`}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-center w-[100px]">
                        {document.document[0].name.length > 40
                          ? `${document.document[0].name.slice(0, 41)}...`
                          : document.document[0].name}
                      </p>
                    </div>
                    <div>
                      <p className="text-center w-[100px]">
                        {" "}
                        {user.user.program}
                      </p>
                    </div>
                    <div>
                      <p className="text-center w-[100px]">
                        {
                          document.document[0].createdAt
                            .toString()
                            .split("T")[0]
                        }
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <a href={document.document[0].documentUrl}>
                        <MdOutlineFileDownload
                          size={16}
                          className="w-[100px] cursor-pointer"
                        />
                      </a>
                    </div>
                    <div>
                      <p className="text-center w-[100px]">Course</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            user.user.role === "ADMIN" && (
              <div
                className={`bg-white w-full p-6 border-t-[#D5D5D5] border-l-[#D5D5D5] border-r-[#D5D5D5] border-[1px] flex items-center ${
                  subAdmins && subAdmins?.length < 1
                    ? "justify-center"
                    : "flex-col gap-y-6 pl-[31px] pr-[78px]"
                }`}
              >
                {subAdmins && subAdmins?.length < 1 ? (
                  <p>No documents yet</p>
                ) : filteredSubAdmins && filteredSubAdmins.length < 1 ? (
                  <p>No results found</p>
                ) : (
                  filteredSubAdmins?.map((subAdmin, index) => (
                    <div
                      className="w-full flex gap-x-[115px] items-center text-left"
                      key={index}
                    >
                      <div>
                        <p className="text-center w-[100px]">
                          {index < 9 ? `000${index + 1}` : `00${index + 1}`}{" "}
                        </p>
                      </div>
                      <div>
                        <p className="text-center w-[100px]">
                          {subAdmin.username}
                        </p>
                      </div>
                      <div>
                        <p className="text-center w-[100px]">
                          {subAdmin.lastname} {subAdmin.firstname}
                        </p>
                      </div>
                      <div>
                        <p className="text-center w-[100px]">
                          {" "}
                          {subAdmin.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-center w-[100px]">
                          {subAdmin.program.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-center w-[100px]">
                          {subAdmin.createdAt.toString().split("T")[0]}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

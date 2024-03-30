"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

const Help = () => {
  const [document, setDocument] = useState<string>();

  const handleSetDocument = (e: ChangeEvent<HTMLInputElement>) => {
    const file = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      file.readAsDataURL(e.target.files[0]);

      file.onload = () => {
        setDocument(file.result as string);
      };
    }
  };

  console.log(document);
  return (
    <div>
      <input type="file" onChange={(e) => handleSetDocument(e)} />
      {document && (
        <Image src={document as string} width={200} height={200} alt="" />
      )}
    </div>
  );
};

export default Help;

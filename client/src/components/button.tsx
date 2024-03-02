import React from "react";

interface IButton {
  style: string;
  text: string;
  handleSubmit: () => void;
}

const Button = ({ style, text, handleSubmit }: IButton) => {
  return (
    <button className={style} onClick={handleSubmit}>
      {text}
    </button>
  );
};

export default Button;

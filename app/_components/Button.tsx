import { HTMLAttributes } from "react";

type ButtonProps = {
  onClick: HTMLAttributes<HTMLButtonElement>["onClick"];
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className="p-2 bg-black text-white mx-1" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

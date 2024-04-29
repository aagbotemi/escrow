import React from "react";
import { Oval } from "react-loader-spinner";

type ButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  allowArrow?: boolean;
  arrowColor?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  loading = false,
  className,
  children,
  allowArrow = true,
  arrowColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`outline-none px-3 md:px-6 min-w-[112px] font-inter   lg:min-w-[190px] h-[54px] flex justify-center items-center group bg-accent  hover:bg-opacity-90 transition-opacity ease-linear delay-150 ${
        disabled
          ? "!bg-opacity-70 cursor-not-allowed"
          : "bg-opacity-100 cursor-pointer"
      } ${className}`}
      disabled={disabled ? true : false}
    >
      {children}

      {loading && (
        <Oval height="25" width="25" color="white" ariaLabel="loading" />
      )}
    </button>
  );
};

export default Button;

import clsx from "clsx";
import React, { useRef } from "react";
import type { FieldErrors, Path, UseFormRegister } from "react-hook-form";
import type { createFormData } from "~/routes/ielts-sheet-create";

type InputProps = {
  label: Path<createFormData>;
  register: UseFormRegister<createFormData>;
  required?: boolean;
  errors: FieldErrors<createFormData>;
};

const TitleInput = ({
  label,
  register,
  required = false,
  errors,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = () => {
    const input = inputRef.current;
    if (input) {
      input.size = input.value.length || 2;
    }
  };

  const { ref, ...rest } = register(label, { required });

  return (
    <input
      {...rest}
      type="text"
      placeholder="title"
      className={clsx(
        "border-b-2 text-4xl focus:outline-0 w-auto text-center caret-transparent",
        {
          "border-b-red-300 focus:border-b-red-500 !border-b-[3px]": !!errors.title,
          "border-b-slate-300 focus:border-b-slate-500": !errors.title,
        }
      )}
      ref={(el) => {
        ref(el); // ✅ hook form ref
        inputRef.current = el; // ✅ your ref
      }}
      size={2}
      onInput={handleInput}
    />
  );
};

export default TitleInput;

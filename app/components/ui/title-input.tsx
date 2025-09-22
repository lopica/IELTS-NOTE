import clsx from "clsx";
import {  useIeltsSheetCreateContext } from "context/ielts-sheet-create-context";
import type { createFormData } from "hooks/useCreateSheet";
import { useRef } from "react";
import type { FieldErrors, Path, UseFormRegister } from "react-hook-form";

type InputProps = {
  label: Path<createFormData>;
  required?: boolean;
};

const TitleInput = ({
  label,
  required = false,
}: InputProps) => {
  const {register, errors} = useIeltsSheetCreateContext()
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

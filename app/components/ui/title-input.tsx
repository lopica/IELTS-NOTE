import React, { useRef } from "react";
import type { Path, UseFormRegister } from "react-hook-form";
import type { createFormData } from "~/routes/ielts-sheet-create";

type InputProps = {
  label: Path<createFormData>
  register: UseFormRegister<createFormData>
  required?: boolean
}

const TitleInput = ({ label, register, required = false }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = () => {
    const input = inputRef.current;
    if (input) {
      input.size = input.value.length || 2;
    }
  };
  
  return (
    <input
      {...register(label, { required })}
      type="text"
      name="title"
      placeholder="title"
      className="border-b-2 border-b-slate-300 text-4xl focus:outline-0 focus:border-b-slate-500 w-auto text-center caret-transparent"
      ref={inputRef}
      size={2}
      onInput={handleInput}
    />
  );
};

export default TitleInput;

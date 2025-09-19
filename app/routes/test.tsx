import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Answer = {
  response: string | number;
  isCorrect: boolean;
};

type FormData = {
  answers: Answer[];
};

export default function MinimalForm() {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      answers: Array.from({ length: 3 }).map(() => ({
        response: "",
        isCorrect: false,
      })),
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Submitted data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <label>Câu {i + 1}</label>
          <input {...register(`answers.${i}.response`)} />
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}

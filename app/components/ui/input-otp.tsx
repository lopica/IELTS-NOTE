
interface OTPInputProps {
  key: number;
  value: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function InputOTP({ value, onKeyDown }: OTPInputProps) {
  return (
    <input
      type="text"
      maxLength={1}
      value={value}
      onKeyDown={onKeyDown}
      onChange={() => {}} // change made with on key down
      className="w-5 h-6 sm:w-6 sm:h-8 border border-black text-center text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      style={{ caretColor: "transparent" }}
    />
  );
}

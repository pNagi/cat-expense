import { twMerge } from "tailwind-merge";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  pendingText?: string;
  isPending?: boolean;
}

export function SubmitButton({
  text,
  pendingText,
  isPending,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      {...props}
      type="submit"
      className={twMerge(
        "btn",
        isPending && "pointer-events-none",
        props.className,
      )}
    >
      {isPending && pendingText ? (
        <>
          <span className="loading loading-spinner"></span> {pendingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}

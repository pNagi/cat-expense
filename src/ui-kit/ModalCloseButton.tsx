import { ButtonHTMLAttributes } from "react";

export function ModalCloseButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      type="button"
      className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
    >
      ✕
    </button>
  );
}

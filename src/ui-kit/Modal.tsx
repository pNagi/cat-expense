import { DialogHTMLAttributes } from "react";

interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function Modal({ children, ref }: ModalProps) {
  return (
    <dialog className="modal" ref={ref}>
      <div className="modal-box max-w-md lg:max-w-2xl">{children}</div>
    </dialog>
  );
}

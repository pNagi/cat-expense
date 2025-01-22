import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { twMerge } from "tailwind-merge";

interface BaseProps {
  inputType: string;
  label: string;
  info?: string;
  errors?: string[] | undefined;
}

type InputProps = BaseProps & {
  inputType: "input";
  inputProps: InputHTMLAttributes<HTMLInputElement> & { name: string };
  children?: undefined;
};

type SelectProps = BaseProps & {
  inputType: "select";
  inputProps: SelectHTMLAttributes<HTMLSelectElement> & { name: string };
  children?: React.ReactNode;
};

export function FormElement({
  inputType,
  inputProps,
  children,
  label,
  info,
  errors,
}: InputProps | SelectProps) {
  const hasError = !!errors?.[0];

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      {inputType === "input" ? (
        <input
          {...inputProps}
          className={twMerge(
            "input input-bordered w-full",
            hasError && "input-error",
          )}
          aria-describedby={`${inputProps.name}-info`}
        />
      ) : (
        <select
          {...inputProps}
          className={twMerge(
            "select select-bordered w-full",
            hasError && "select-error",
          )}
          aria-describedby={`${inputProps.name}-info`}
        >
          {children}
        </select>
      )}
      <div className="label py-1">
        <span
          id={`${inputProps.name}-info`}
          className={twMerge(
            "label-text-alt",
            hasError ? "text-error" : info ? "" : "invisible",
          )}
        >
          {errors?.[0] ?? info ?? "."}
        </span>
      </div>
    </label>
  );
}

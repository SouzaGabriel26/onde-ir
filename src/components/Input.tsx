import { sanitizeClassName } from '@/utils/sanitizeClassName';

type InputProps = JSX.IntrinsicElements['input'] & {
  id: string;
  label: string;
};

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        {...props}
        className={sanitizeClassName(
          `
            peer
            h-12
            w-full
            rounded-lg
            border
            border-gray-300
            px-3
            pt-3
            text-sm
            outline-none
            placeholder-shown:pt-0
            dark:border-zinc-700
          `,
          className,
        )}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`
          absolute
          left-3
          top-1
          cursor-text
          text-xs
          text-gray-500
          transition-all
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-sm
          dark:text-slate-200
        `}
      >
        {label}
      </label>
    </div>
  );
}
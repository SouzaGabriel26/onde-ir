type ArrowLeftProps = React.SVGAttributes<SVGElement>;

export function ArrowLeft({ ...props }: ArrowLeftProps) {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 12H20M4 12L8 8M4 12L8 16"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

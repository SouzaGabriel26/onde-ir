export function TextInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-500">{label} </span>
      <span>{value}</span>
    </div>
  );
}

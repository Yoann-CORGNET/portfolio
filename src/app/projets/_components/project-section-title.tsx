export function ProjectSectionTitle({
  lines,
  className,
  as: Tag = "h2",
}: Readonly<{ lines: readonly string[]; className: string; as?: "h2" | "h3" }>) {
  return (
    <Tag className={className}>
      {lines.map((line) => (
        <span key={line} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </Tag>
  );
}

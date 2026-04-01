export const highlightMatch = (suggestion: string, query: string) => {
  if (!query.trim()) return suggestion;

  const parts = suggestion.split(new RegExp(`(${query})`, "gi"));

  return (
    <div>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === query.toLowerCase()
              ? "font-medium text-gray-900 opacity-100"
              : "font-normal text-gray-500"
          }
        >
          {part}
        </span>
      ))}
    </div>
  );
};

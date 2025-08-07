export function Loading({ content }: { content: string }) {
  switch (content) {
    case "name":
      return <span className="w-8 h-3 bg-gray-400"></span>;
    default:
      return "Loading....";
  }
}

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500 hover:bg-green-600";
      case "GRADUATED":
        return "bg-purple-500 hover:bg-purple-600";
      case "TRANSFERED":
        return "bg-blue-500 hover:bg-blue-600";
      case "SUSPENDED":
        return "bg-orange-500 hover:bg-orange-600";
      case "EXPELLED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return <Badge className={getStatusColor(status)}>{status}</Badge>;
}

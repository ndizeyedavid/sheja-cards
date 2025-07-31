import { Badge } from "@/components/ui/badge";
import { StaffRole } from "@/types/staff";

const roleColors: Record<StaffRole, string> = {
  Headmaster: "bg-blue-500",
  DOS: "bg-purple-500",
  Bursar: "bg-green-500",
  Teacher: "bg-amber-500",
  Secretary: "bg-pink-500",
  Librarian: "bg-teal-500",
};

export function RoleBadge({ role }: { role: StaffRole }) {
  return <Badge className={`${roleColors[role]} text-white`}>{role}</Badge>;
}

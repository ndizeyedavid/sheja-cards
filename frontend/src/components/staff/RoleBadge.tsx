import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
    role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
    const getRoleColor = (role: string) => {
        switch (role) {
            case "Headmaster":
                return "bg-blue-500 hover:bg-blue-600";
            case "DOS":
                return "bg-purple-500 hover:bg-purple-600";
            case "BURSAR":
                return "bg-green-500 hover:bg-green-600";
            case "TEACHER":
                return "bg-orange-500 hover:bg-orange-600";
            case "PATRON":
                return "bg-pink-500 hover:bg-pink-600";
            case "Librarian":
                return "bg-teal-500 hover:bg-teal-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    return <Badge className={getRoleColor(role)}>{role}</Badge>;
}

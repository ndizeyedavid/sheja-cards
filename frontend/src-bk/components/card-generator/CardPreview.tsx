import { Student, CardTemplate } from "@/types/card-generator";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CardPreviewProps {
  student: Student | null;
  template: CardTemplate;
}

export function CardPreview({ student, template }: CardPreviewProps) {
  if (!student) {
    return (
      <Card className="flex items-center justify-center h-[220px] border-dashed">
        <p className="text-muted-foreground">
          Select a student to preview card
        </p>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${template.bgColor} transition-colors`}>
      <div className="flex gap-4">
        <Avatar className="h-24 w-24 border-4 border-white">
          <AvatarImage src={student.profileImage} alt={student.fullName} />
          <AvatarFallback>{student.fullName[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{student.fullName}</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{student.class}</Badge>
            <Badge variant="outline">{student.status}</Badge>
          </div>
          <div className="text-sm space-y-1">
            <p>Reg No: {student.registrationNumber}</p>
            <p>Year: {student.year}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  DollarSign,
  CreditCard,
  Building2,
  Users2,
  UserSquare2,
} from "lucide-react";
import RenderGreeting from "./RenderGreeting";

export const SectionCards: React.FC = () => {
  return (
    <section className="bg-background px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col mb-3 sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <RenderGreeting />
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your schools analytics
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {Number(4450).toLocaleString()}
                  </p>
                </div>
                <Users2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Classes
                  </p>
                  <p className="text-2xl font-bold text-foreground">15</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Staff Members
                  </p>
                  <p className="text-2xl font-bold text-foreground">4</p>
                </div>
                <UserSquare2 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Academic Year
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    2024 / 2025
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

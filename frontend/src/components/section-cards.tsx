import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  DollarSign,
  CreditCard,
  Building2,
} from "lucide-react";

export const SectionCards: React.FC = () => {
  return (
    <section className="bg-background px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col mb-3 sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Money Transfer Transactions
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your transfer transactions
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
                    Total Volume
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    $4,450.00
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Platform Revenue
                  </p>
                  <p className="text-2xl font-bold text-foreground">$89.00</p>
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
                    Total Fees
                  </p>
                  <p className="text-2xl font-bold text-foreground">$297.50</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transactions
                  </p>
                  <p className="text-2xl font-bold text-foreground">3</p>
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconUserPlus } from "@tabler/icons-react";
import { NewStaffData, StaffRole } from "@/types/staff";

interface AddStaffModalProps {
  onAddStaff: (data: NewStaffData) => void;
}

export function AddStaffModal({ onAddStaff }: AddStaffModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewStaffData>({
    name: "",
    email: "",
    role: "Teacher",
    phone: "",
    idNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStaff(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconUserPlus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <Select
            value={formData.role}
            onValueChange={(value: StaffRole) =>
              setFormData({ ...formData, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="DOS">DOS</SelectItem>
              <SelectItem value="Bursar">Bursar</SelectItem>
              <SelectItem value="Headmaster">Headmaster</SelectItem>
              <SelectItem value="Secretary">Secretary</SelectItem>
              <SelectItem value="Librarian">Librarian</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid gap-2">
            <Input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="ID Number"
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit">Send Invite</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

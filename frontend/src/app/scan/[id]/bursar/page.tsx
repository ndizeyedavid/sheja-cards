"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import pb from "@/lib/pb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  schoolFeesService,
  SchoolFee,
  SchoolFeeStructure,
} from "@/services/schoolFees.service";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Student = {
  id: string;
  name: string;
  status: string;
  registrationNumber: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  expand: {
    Class: {
      name: string;
      combination: string;
      academicYear: string;
    };
    school: School;
  };
};

type School = {
  id: string;
  name: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
};

export default function BursarPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState<string>("");
  const [feeStructure, setFeeStructure] = useState<SchoolFeeStructure[]>([]);
  const [studentFees, setStudentFees] = useState<SchoolFee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeeStructureDialogOpen, setIsFeeStructureDialogOpen] =
    useState(false);
  const [currentTerm, setCurrentTerm] = useState<number>(1);
  const [newFeeStructure, setNewFeeStructure] = useState<
    Partial<SchoolFeeStructure>
  >({
    schoolId: school?.id || "",
    academicYear: academicYear,
    term: 1,
    amount: 0,
    dueDate: new Date().toISOString(),
  });
  const [newPayment, setNewPayment] = useState<Partial<SchoolFee>>({
    studentId: id as string,
    term: 1,
    amount: 0,
    paymentMethod: "cash",
    status: "paid",
    notes: "",
  });

  useEffect(() => {
    async function fetchDetails() {
      try {
        const studentRecord = await pb
          .collection("students")
          .getOne(id as string, {
            expand: "Class, school",
          });
        setStudent(studentRecord as Student);
        setSchool(studentRecord.expand.school as School);
        setAcademicYear(studentRecord.expand.Class.academicYear);
      } catch (err: any) {
        console.error("ERROR: ", err);
        console.error("PB ERROR: ", err.response);
        setError(err.message || "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    }

    if (!pb.authStore.record) return router.replace(`/scan/${id}`);
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (student && school && academicYear) {
      fetchFeeData();
    }
  }, [student, school, academicYear]);

  const fetchFeeData = async () => {
    try {
      const structure = await schoolFeesService.getFeeStructure(
        school!.id,
        academicYear
      );
      setFeeStructure(structure);

      const fees = await schoolFeesService.getStudentFees(
        student!.id,
        academicYear
      );
      setStudentFees(fees);
    } catch (err: any) {
      console.error("Error fetching fee data:", err);
      console.error("PB ERROR:", err.repsonse);
      toast.error("Failed to load fee information");
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!newPayment.receiptNumber) {
        toast.error("Receipt number is required");
        return;
      }

      if (!newPayment.amount || newPayment.amount <= 0) {
        toast.error("Amount must be greater than zero");
        return;
      }

      const paymentData: SchoolFee = {
        ...(newPayment as SchoolFee),
        studentId: student!.id,
        academicYear,
        paymentDate: new Date().toISOString(),
      };

      await schoolFeesService.createFeePayment(paymentData);
      toast.success("Payment recorded successfully");
      setIsDialogOpen(false);
      fetchFeeData();

      // Reset form
      setNewPayment({
        studentId: id as string,
        term: 1,
        amount: 0,
        paymentMethod: "cash",
        status: "paid",
        notes: "",
      });
    } catch (err) {
      console.error("Error recording payment:", err);
      toast.error("Failed to record payment");
    }
  };

  const getTermStatus = (term: number) => {
    const termFee = studentFees.find((fee) => fee.term === term);
    if (!termFee) return { status: "pending", amount: 0 };
    return { status: termFee.status, amount: termFee.amount };
  };

  const getTermStructure = (term: number) => {
    return feeStructure.find((structure) => structure.term === term);
  };

  const openPaymentDialog = (term: number) => {
    setCurrentTerm(term);
    setNewPayment({
      ...newPayment,
      term,
      amount: getTermStructure(term)?.amount || 0,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !student || !school) {
    return <div>Error: {error || "Failed to load details"}</div>;
  }

  const handleFeeStructureSubmit = async () => {
    try {
      if (!newFeeStructure.amount || newFeeStructure.amount <= 0) {
        toast.error("Amount must be greater than zero");
        return;
      }

      if (!newFeeStructure.dueDate) {
        toast.error("Due date is required");
        return;
      }

      const structureData: SchoolFeeStructure = {
        ...(newFeeStructure as SchoolFeeStructure),
        schoolId: school!.id,
        academicYear,
      };

      await schoolFeesService.createFeeStructure(structureData);
      toast.success("Fee structure created successfully");
      setIsFeeStructureDialogOpen(false);
      fetchFeeData();

      // Reset form
      setNewFeeStructure({
        schoolId: school?.id || "",
        academicYear: academicYear,
        term: 1,
        amount: 0,
        dueDate: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error creating fee structure:", err);
      toast.error("Failed to create fee structure");
    }
  };

  // mi🤗 auth logout logic, lame isn't it😂
  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    pb.authStore.clear();
    router.push(`/scan/${id}`);
  };

  return (
    <>
      <header
        id="no-print"
        className="flex h-(--header-height) py-4 mb-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
      >
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <div className="flex items-center gap-1">
            <IconInnerShadowTop className="-ml-1" />
            <span className=" font-bold">SHEJA Cards</span>
          </div>
          <Separator
            orientation="vertical"
            className="mx-7 data-[orientation=vertical]:h-4"
          />
          <div className="">
            {loading ? (
              <Skeleton className="w-[150px] h-8" />
            ) : (
              <span className="text-center font-medium">
                {student.expand.school.name}
              </span>
            )}
          </div>
          <div className="ml-14 flex items-center gap-2">
            <AcademicYearSelector disabled={true} />
          </div>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="mr-5">
          Logout
        </Button>
      </header>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Bursar Management</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="#" className="hover:underline">
              {student.expand.school.name}
            </Link>
            <span>/</span>
            <Link href="#" className="hover:underline">
              {student.expand.Class.name} {student.expand.Class.combination}
            </Link>
            <span>/</span>
            <Link href={`/scan/${student.id}`} className="hover:underline">
              {student.name}
            </Link>
            <span>/</span>
            <span>Bursar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Fees Management</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Academic Year: {academicYear}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <Avatar className="size-[80px]">
                  <AvatarImage
                    src={pb.files.getURL(student, student.profileImage)}
                    alt={student.name}
                  />
                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{student.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {student.expand.Class.name}{" "}
                    {student.expand.Class.combination}
                  </p>
                  <p className="text-sm">
                    <strong>Registration Number:</strong>{" "}
                    {student.registrationNumber}
                  </p>
                </div>
              </div>

              <Separator orientation="horizontal" className="my-4" />

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Fee Structure</h3>
                  <Dialog
                    open={isFeeStructureDialogOpen}
                    onOpenChange={setIsFeeStructureDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Add Fee Structure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create Fee Structure</DialogTitle>
                        <DialogDescription>
                          Add a new fee structure for {academicYear}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="term" className="text-right">
                            Term
                          </Label>
                          <Select
                            value={String(newFeeStructure.term)}
                            onValueChange={(value) =>
                              setNewFeeStructure({
                                ...newFeeStructure,
                                term: parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Term 1</SelectItem>
                              <SelectItem value="2">Term 2</SelectItem>
                              <SelectItem value="3">Term 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            value={newFeeStructure.amount || ""}
                            onChange={(e) =>
                              setNewFeeStructure({
                                ...newFeeStructure,
                                amount: parseFloat(e.target.value),
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dueDate" className="text-right">
                            Due Date
                          </Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newFeeStructure.dueDate?.split("T")[0] || ""}
                            onChange={(e) =>
                              setNewFeeStructure({
                                ...newFeeStructure,
                                dueDate: new Date(e.target.value).toISOString(),
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleFeeStructureSubmit}>
                          Save Structure
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Term</TableHead>
                      <TableHead>Amount (RWF)</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.length > 0 ? (
                      feeStructure.map((fee) => {
                        const termStatus = getTermStatus(fee.term);
                        return (
                          <TableRow key={fee.term}>
                            <TableCell>Term {fee.term}</TableCell>
                            <TableCell>{fee.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  termStatus.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : termStatus.status === "partial"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {termStatus.status.charAt(0).toUpperCase() +
                                  termStatus.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openPaymentDialog(fee.term)}
                              >
                                Record Payment
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No fee structure found for this academic year
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Separator orientation="horizontal" className="my-4" />

              <div>
                <h3 className="font-semibold mb-4">Payment History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Amount (RWF)</TableHead>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentFees.length > 0 ? (
                      studentFees.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell>
                            {new Date(fee.paymentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>Term {fee.term}</TableCell>
                          <TableCell>{fee.amount.toLocaleString()}</TableCell>
                          <TableCell>{fee.receiptNumber}</TableCell>
                          <TableCell>
                            {fee.paymentMethod.charAt(0).toUpperCase() +
                              fee.paymentMethod.slice(1)}
                          </TableCell>
                          <TableCell>{fee.notes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No payment records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Fee Payment</DialogTitle>
            <DialogDescription>
              Record a new payment for Term {currentTerm} of {academicYear}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={newPayment.amount || ""}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    amount: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receipt" className="text-right">
                Receipt #
              </Label>
              <Input
                id="receipt"
                value={newPayment.receiptNumber || ""}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    receiptNumber: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Method
              </Label>
              <Select
                value={newPayment.paymentMethod}
                onValueChange={(value) =>
                  setNewPayment({ ...newPayment, paymentMethod: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newPayment.status}
                onValueChange={(value: "paid" | "partial" | "pending") =>
                  setNewPayment({ ...newPayment, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newPayment.notes || ""}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, notes: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handlePaymentSubmit}>
              Save Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

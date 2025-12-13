"use client";

import { StudentReport } from "@/types/reports.types";
import pb from "@/lib/pb";

interface ReportPrintTemplateProps {
  report: StudentReport;
  schoolName?: string;
  schoolInfo?: {
    address?: string;
    district?: string;
    poBox?: string;
    phone?: string;
    email?: string;
  };
}

export const ReportPrintTemplate = ({
  report,
  schoolName,
  schoolInfo,
}: ReportPrintTemplateProps) => {
  // Get school info from pb.authStore
  const schoolData = pb.authStore.record?.expand?.school;
  // console.log(schoolData);
  const finalSchoolName = schoolData?.name || "SHEJA SCHOOL";
  const finalSchoolInfo = {
    address: schoolData?.address || "KIGALI CITY",
    district: schoolData?.district || "KICUKIRO",
    poBox: schoolData?.poBox || "3806",
    phone: schoolData?.phone || "0784605269",
    email: schoolData?.email || "info@sheja.edu.rw",
  };

  const calculatePercentage = (cat: number, exam: number) => {
    const total = cat + exam;
    return total > 0 ? Math.round((total / 200) * 100) : 0;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 85) return "A";
    if (percentage >= 75) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  // Calculate overall percentage based on sum of all subject totals divided by max possible
  const totalSubjectMarks = report.subjects.reduce(
    (sum, subject) => sum + subject.total,
    0
  );
  const maxPossibleMarks = report.subjects.length * 200; // Each subject is out of 100 then being 2(CAT, EX) = 200
  const overallPercentage =
    maxPossibleMarks > 0
      ? Number(((totalSubjectMarks / maxPossibleMarks) * 100).toFixed(2))
      : 0;
  const overallGrade = getGrade(overallPercentage);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "20px",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <fieldset
        style={{
          border: "2px solid black",
          padding: "20px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "20px",
            marginBottom: "30px",
            alignItems: "start",
          }}
        >
          {/* School Location Info */}
          <div>
            <p
              style={{ fontSize: "12px", lineHeight: "10px", margin: "5px 0" }}
            >
              <b>REPUBLIC OF RWANDA</b>
            </p>
            <p
              style={{ fontSize: "12px", lineHeight: "10px", margin: "5px 0" }}
            >
              <b>MINISTRY OF EDUCATION</b>
            </p>
            <p
              style={{ fontSize: "12px", lineHeight: "10px", margin: "5px 0" }}
            >
              <b>{finalSchoolName.toUpperCase()}</b>
            </p>
            <p
              style={{
                fontSize: "12px",
                lineHeight: "10px",
                margin: "5px 0",
                width: "100px",
              }}
            >
              <b>Address: {finalSchoolInfo.address}</b>
            </p>

            <p
              style={{ fontSize: "12px", lineHeight: "10px", margin: "5px 0" }}
            >
              <b>TEL: {finalSchoolInfo.phone}</b>
            </p>
            <p
              style={{ fontSize: "12px", lineHeight: "10px", margin: "5px 0" }}
            >
              <b>E-mail: {finalSchoolInfo.email}</b>
            </p>
          </div>

          {/* School Logo Placeholder */}
          <div
            style={{
              width: "80px",
              height: "80px",
              //   border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            {/* {console.log(schoolData.id)} */}
            <img
              src={pb.files.getURL(schoolData, schoolData.logo)}
              className="w-full h-full"
              alt=""
            />
            {/* <span style={{ fontSize: "10px", color: "#999" }}>LOGO</span> */}
          </div>

          {/* Student Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
              justifyContent: "right",
            }}
          >
            <div>
              <div>
                <span style={{ fontSize: "12px" }}>
                  <b>Student ID:</b>
                </span>
              </div>
              <div>
                <span style={{ fontSize: "12px" }}>
                  <b>NAMES:</b>
                </span>
              </div>
              <div>
                <span style={{ fontSize: "12px" }}>
                  <b>Class:</b>
                </span>
              </div>

              <div>
                <span style={{ fontSize: "12px" }}>
                  <b>YEAR:</b>
                </span>
              </div>
            </div>

            <div>
              <div>
                <b>
                  <span style={{ fontSize: "12px" }}>{report.id}</span>
                </b>
              </div>
              <div>
                <b>
                  <span style={{ fontSize: "12px" }}>
                    {report.name.toUpperCase()}
                  </span>
                </b>
              </div>
              <div>
                <b>
                  <span style={{ fontSize: "12px" }}>{report.className}</span>
                </b>
              </div>
              <div>
                <b>
                  <span style={{ fontSize: "12px" }}>
                    {localStorage.getItem("academicYear")}
                  </span>
                </b>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: "10px 0", fontSize: 28, fontWeight: "bold" }}>
            <b>STUDENT'S PROGRESSIVE SCHOOL REPORT</b>
          </h1>
        </div>

        {/* Marks Table */}
        <table
          className="border-double"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "30px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "left",
                  backgroundColor: "#f0f0f0",
                }}
                rowSpan={2}
              >
                SUBJECT NAME
              </th>
              <th
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: "#f0f0f0",
                }}
                colSpan={3}
              >
                <b>MARKS</b>
              </th>
              <th
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: "#f0f0f0",
                }}
                colSpan={2}
              >
                OBSERVATION
              </th>
            </tr>
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                CAT/100
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                EXAM/100
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                TOTAL
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  width: "5%",
                }}
              >
                %
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  width: "5%",
                }}
              >
                GRADE
              </td>
            </tr>
          </thead>
          <tbody>
            {report.subjects.map((subject) => {
              const percentage = calculatePercentage(subject.cat, subject.exam);
              const grade = getGrade(percentage);
              const isBelowPass = percentage < 50;

              return (
                <tr key={subject.subjectId}>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {subject.subjectName}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      textAlign: "center",
                      textDecoration: subject.cat < 20 ? "underline" : "none",
                    }}
                  >
                    {subject.cat}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      textAlign: "center",
                      textDecoration: subject.exam < 30 ? "underline" : "none",
                    }}
                  >
                    {subject.exam}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {subject.total}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      textAlign: "center",
                      textDecoration: isBelowPass ? "underline" : "none",
                    }}
                  >
                    {percentage}%
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                      padding: "10px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {grade}
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                TOTAL
              </td>
              <td
                colSpan={4}
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {report.total}
              </td>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                }}
              ></td>
            </tr>

            {/* Percentage Row */}
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                PERCENTAGE
              </td>
              <td
                colSpan={3}
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {overallPercentage}%
              </td>
              <td
                colSpan={2}
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {overallGrade}
              </td>
            </tr>

            {/* Position Row */}
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                POSITION
              </td>
              <td
                colSpan={3}
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <b>{report.position} Out of -</b>
              </td>
              <td
                colSpan={2}
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  backgroundColor: "#d3d3d3",
                }}
              ></td>
            </tr>

            {/* teacher's comment */}
            <tr>
              <td
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                TEACHER'S COMMENT AND SIGNATURE
              </td>
              <td
                colSpan={5}
                style={{
                  border: "2px solid black",
                  padding: "10px",
                  textAlign: "center",
                }}
              ></td>
            </tr>
          </tbody>
        </table>

        {/* Footer Section */}
        <div
          style={{
            marginTop: "5px",
          }}
          className="flex flex-col gap-1"
        >
          <div>
            <p>
              ON <u>{new Date().getDate()}</u>/
              <u>{new Date().getMonth() + 1}</u>/
              <u>{new Date().getFullYear()}</u>
            </p>
          </div>
          <div>
            <p>
              <b>SCHOOL MANAGER</b>
            </p>
            <p>
              <b>{pb.authStore.record?.name}</b>
            </p>
            <p style={{ fontSize: "13px" }}>Signature & Stamp</p>
          </div>
        </div>
      </fieldset>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportPrintTemplate;

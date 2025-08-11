export function generateTemplate(selectedClass: string) {
    // Add a header/title row (merged cells won't work in CSV, so just plain text)
    const headerTitle = [`Student Template for Class ${selectedClass}`];

    // Empty row after title for spacing (optional)
    const emptyRow = [""];

    // Column headers
    const headers = ["Name", "Gender", "Date of Birth", "Registration Number(Optional)"];

    // Combine all rows
    const template = [headerTitle, emptyRow, headers];

    // Convert to CSV
    const csvContent = template.map((row) => row.join(",")).join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], {
        type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${selectedClass}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

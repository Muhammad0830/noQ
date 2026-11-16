type DataType = string[]

export const downloadCsv = ({ data, fileName }: { data: DataType[], fileName: string }) => {
    const csvRows = [...data];

    const csv = csvRows.map((row) => row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
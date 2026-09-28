import { BaseTable } from "@components/Table";
import TableBody from "@components/Table/TableBody";
import TableRow from "@components/Table/TableRow";
import { TableCell, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, type ReactNode } from "react";
import type { TableHeaderType } from "@components/Table/TableBody"

const scheduleHeaders: TableHeaderType[] = [
    { label: "Class", width: "120px" },
    { label: "Subject", width: "150px" },
    { label: "Day", width: "120px" },
    { label: "Time", width: "180px", },
    { label: "Teacher", width: "150px" },
    { label: "Room", width: "100px" },
];

interface ScheduleItem {
    id: number;
    className: string;
    subject: string;
    day: string;
    time: string;
    teacher: string;
    room: string;
}


const DashboardScheduleTable = () => {
    const [isLoading, setIsLoading] = useState(false);


    const renderActions = (item: ScheduleItem) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <IconButton size="small" color="primary" onClick={() => console.log("Edit", item.id)}>
                <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => console.log("Delete", item.id)}>
                <Delete fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => console.log("Read", item.id)}>
                <Delete fontSize="small" />
            </IconButton>
        </div>
    );
    const dummyData: ScheduleItem[] = [
        { id: 1, className: "10-A", subject: "Math", day: "Senin", time: "08.00 - 10.00", teacher: "Pak Budi", room: "101", },
        { id: 2, className: "10-B", subject: "Physics", day: "Selasa", time: "10.00 - 12.00", teacher: "Bu Siti", room: "102" },
        { id: 3, className: "11-A", subject: "Chemistry", day: "Rabu", time: "08.00 - 09.30", teacher: "Pak Joko", room: "103" },
    ];
    const [data] = useState<ScheduleItem[]>(dummyData);


    return (
        <BaseTable>
            <TableBody
                header={scheduleHeaders}
                isLoading={isLoading}
                dataLength={data.length}
                skeletonRows={3}
            >
                {data.map((item, index) => (
                    <TableRow
                        key={item.id}
                        index={index}
                        header={scheduleHeaders}
                        actions={renderActions(item)}
                    >
                        <TableCell sx={{ py: 1 }}>{item.className}</TableCell>
                        <TableCell sx={{ py: 1 }}>{item.subject}</TableCell>
                        <TableCell sx={{ py: 1 }}>{item.day}</TableCell>
                        <TableCell sx={{ py: 1 }}>{item.time}</TableCell>
                        <TableCell sx={{ py: 1 }} >{item.teacher}</TableCell>
                        <TableCell sx={{ py: 1 }} >{item.room}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </BaseTable>
    );
};

export default DashboardScheduleTable;
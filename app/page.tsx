"use client";
import { useState } from "react";
import Task from '@/components/task/Task';
import LeaveDetails from "@/components/leave/Leave";
import TimeSheet from "@/components/timesheet/timesheet";
import UCCard from "@/components/ui/card";
import UCTable from "@/components/ui/table/table";
import UCTableBody from "@/components/ui/table/tbody";
import UCTableRow from "@/components/ui/table/tr";
import UCTableHeaderCell from "@/components/ui/table/th";
import UCTableCell from "@/components/ui/table/td";
import UCTableHeader from "@/components/ui/table/thead";

export default function Home() {
  const [date, setDate] = useState<string>("");

  const getDate = (date: Date | undefined): string => {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero indexed
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  };

  return (
    <div className="flex flex-col m-3">
      <UCCard title="Task(s)">
        <Task></Task>
      </UCCard>
      <UCCard title="Leaves">
        <LeaveDetails></LeaveDetails>
      </UCCard>
      <UCCard title="Timesheet">
        <TimeSheet />
      </UCCard>
    </div>
  );
}

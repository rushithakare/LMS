"use client";
import { useState } from "react";
import Task from '@/components/task/Task';
import LeaveDetails from "@/components/leave/Leave";
import TimeSheet from "@/components/timesheet/timesheet";
import UCCard from "@/components/ui/card";

export default function Home() {

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

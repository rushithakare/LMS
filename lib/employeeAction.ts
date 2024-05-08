"use server";

import dbConnect from "@/store/dbConnect";
import Employee from "@/models/Employee";
import { UpdateEx } from "@/store/tempStore";
import { Update } from "@/store/employeeStore";

export async function create(formData: {
  name: string;
  email: string;
  password: string;
}): Promise<{
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
}> {
  await dbConnect();

  const userAuth = {
    name: "tst",
    email: formData.email,
    password: formData.password,
  };

  const x = await Employee.create({
    empId: "Hari",
    leaves: { casual: { total: 5, applied: [new Date(2024, 0, 27)] } },
  });

  console.log(x);

  return new Promise((resolve) => {
    resolve({
      name: undefined,
      email: "Email already exists. Please user another email",
      password: undefined,
    });
  });
}

export const getEmployee = async () => {
  await dbConnect();
  const x = await Employee.findOne({ empId: "INEMP123" }, { leaves: 1 });
  console.log(x);
  return x;
};

export const getAllLeaves = async (empId: string, year: string) => {
  await dbConnect();
  const x = await Employee.findOne({ empId: empId }, { leaves: 1 });
  let allLeavesList: {
    startDate: string;
    endDate: string;
    noOfDays: number;
    duration: string;
    reason: string;
  }[] = [];
  for (const data in x.leaves[year]) {
    //console.log(data);
    for (const entry in x.leaves[year][data]) {
      const splittedArray = x.leaves[year][data][entry].split("|");
      allLeavesList.push({
        startDate: entry,
        endDate: splittedArray[0],
        noOfDays: splittedArray[1],
        duration: splittedArray[2],
        reason: splittedArray[3],
      });
    }
  }
  console.log(allLeavesList);
  return allLeavesList;
};

export const applyLeave = async (
  employeeID: string,
  leaves: {
    start: Date;
    end: Date;
    type: string;
    duration: "half" | "full";
    reason: string;
  },
) => {

  const leave = leaves;

  const year = leave.start.getFullYear().toString();


  const startDateKey = convertDatetoKey(leave.start);
  const endDateKey = convertDatetoKey(leave.end);
  const noOfDays = getDiffInDays(leaves.start, leaves.end);

  const leaveEntry = `${endDateKey}|${noOfDays}|${leave.duration}|${leave.reason}`;


  const result = Update(
    employeeID,
    `leaves.${year}.${leave.type}.${startDateKey}`,
    leaveEntry,
  );
  return { success: true, leaves };
};

const convertDatetoKey = (date: Date) => {
  const key = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  return key;
};

function getDiffInDays(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays + 1;
}

export const deleteLeave = async (employeeID: string, date: string) => {
  try {
    await dbConnect();
    const employee = await Employee.findOne({ empId: employeeID });
    console.log(employee);

    if (!employee) {
      throw new Error("Employee not found");
    }

    const leaves = employee.leaves;
    console.log(leaves);

    if (leaves[date]) {
      delete leaves[date];
      employee.markModified("leaves");
      await employee.save();
      return { success: true };
    } else {
      return {
        success: false,
        error: "Leave entry not found for the specified date",
      };
    }
  } catch (error) {
    console.error("Error deleting leave:", error);
    return { success: false, error };
  }
};

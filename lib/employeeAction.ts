"use server";

import dbConnect from "@/store/dbConnect";
import Employee from "@/models/Employee";
import { UpdateEx } from "@/store/tempStore";

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
  const x = await Employee.findOne({ empId: "INEMP123" });
  //console.log(x);
  return x;
};

export const applyLeave = async (
  employeeID: string,
  leaves: {
    start: Date;
    end: Date;
    type: string;
    duration: "half" | "full";
    reason: string;
  }[],
) => {
  // await dbConnect();
  // let employee = await Employee.findOne({ empId: employeeID });

  // const leave = leaves[0];

  // const year = leave.start.getFullYear().toString();

  // if (!employee) {
  //   employee = new Employee({
  //     empId: employeeID,
  //     leaves: { [year]: {} },
  //   });
  // } else if (!employee.leaves) {
  //   employee.leaves = { [year]: {} };
  // } else if (!employee.leaves[year]) {
  //   employee.leaves[year][leaves[0].type] = {};
  // }

  // console.log(employee);

  // const startDateKey = convertDatetoKey(leave.start);
  // const endDateKey = convertDatetoKey(leave.end);
  // const noOfDays = getDiffInDays(leaves[0].start, leaves[0].end);

  // const leaveEntry = `${endDateKey}|${noOfDays}|${leave.duration}|${leave.reason}`;

  // if (!employee.leaves[year][leaves[0].type].hasOwnProperty(startDateKey)) {
  //   employee.leaves[year][leaves[0].type][startDateKey] = leaveEntry;
  // } else {
  //   console.log("Already exists", employee.leaves[year][leaves[0].type][startDateKey]);
  //   return { success: false, leaveEntry };
  // }

  // employee.markModified("leaves");
  // const savedEmployee = await employee.save();
  // return { success: true, leaveEntry };

  const result = UpdateEx(employeeID,"leaves","leaves.2024.Casual",{available:30});
  return {success:true,leaves}

  
};

// export const applyLeave = async (
//   employeeID: string,
//   leaves: {
//     start: Date;
//     end: Date;
//     type: string;
//     duration: "half" | "full";
//     reason: string;
//   }[],
// ) => {
//   await dbConnect();
//   let employee = await Employee.findOne({ empId: employeeID });

//   // If employee doesn't exist, create a new one
//   if (!employee) {
//     employee = new Employee({
//       empId: employeeID,
//     });
//   }

//   const leave = leaves[0];

//   const startDateKey = convertDatetoKey(leave.start);
//   const endDateKey = convertDatetoKey(leave.end);
//   const noOfDays = getDiffInDays(leave.start, leave.end);

//   const leaveEntry = `${endDateKey}|${leave.type}|${noOfDays}|${leave.duration}|${leave.reason}`;

//   const year = leave.start.getFullYear().toString();

//   // If year key doesn't exist, create it
//   if (!employee[year]) {
//     employee[year] = {};
//   }

//   // Add leave entry under year key
//   employee[year][startDateKey] = leaveEntry;

//   // Save the modified employee object
//   employee.markModified([year]);
//   const savedEmployee = await employee.save();
//   return { success: true, leaveEntry };
// };

const convertDatetoKey = (date: Date) => {
  const key = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  return key;
};

function getDiffInDays(startDate: Date, endDate: Date): number {
  // startDate = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
  // endDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate());
  // console.log(startDate,endDate);
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

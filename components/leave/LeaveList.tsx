import { useEffect, useState } from "react";
import { getEmployee, deleteLeave, getAllLeaves } from "@/lib/employeeAction";
import UCCard from "../ui/card";
import UCTable from "../ui/table/table";
import UCTableHeader from "../ui/table/thead";
import UCTableRow from "../ui/table/tr";
import UCTableHeaderCell from "../ui/table/th";
import UCTableBody from "../ui/table/tbody";
import UCTableCell from "../ui/table/td";
import { XMarkIcon } from "@heroicons/react/24/outline";

const LeaveList: React.FC = ({}) => {
  const [leaveData, setLeaveData] = useState<any[]>([]);

  useEffect(() => {
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    const employeeData = await getEmployee();
    setLeaveData(employeeData.leaves);
  };

  const parseLeaveDetails = (details: string) => {
    const [endDate, type, noOfDays, duration, reason] = details.split("|");
    return { endDate, type, noOfDays, duration, reason };
  };

  const groupedLeaves: Record<string, [object][]> = {};

  // const getEmployeeLeavesByType = () => {
  //   Object.entries(leaveData.leaves[new Date().getFullYear()] || {}).forEach(
  //     ([startDate, details]) => {
  //       const { endDate, type, noOfDays } = parseLeaveDetails(details);
  //       if (!groupedLeaves[type]) {
  //         groupedLeaves[type] = [];
  //       }
  //       groupedLeaves[type].push([startDate, endDate, noOfDays]);
  //     }
  //   );
  // };

  const getEmployeeLeavesByType = () => {
    console.log(leaveData);
    Object.entries(leaveData[new Date().getFullYear()] || {}).forEach(
      ([type, details]) => {
        if (!groupedLeaves[type]) {
          groupedLeaves[type] = [];
        }
        Object.entries(details)
        console.log(type, details);
        groupedLeaves[type].push();
      },
    );
    console.log(groupedLeaves);
  };

  getEmployeeLeavesByType();

  return (
    <>
      {/* {Object.entries(groupedLeaves).map(([type, leaves], index) => (
        <UCCard
          key={index}
          title={type}
          subTitle={`Allotted-${10} Utilized-${0} Balance-${10}`}
        >
          <UCTable className="text-center">
            <UCTableHeader>
              <UCTableRow>
                <UCTableHeaderCell>Start Date</UCTableHeaderCell>
                <UCTableHeaderCell>End Date</UCTableHeaderCell>
                <UCTableHeaderCell>Day</UCTableHeaderCell>
                <UCTableHeaderCell>Duration</UCTableHeaderCell>
                <UCTableHeaderCell>Reason</UCTableHeaderCell>
                <UCTableHeaderCell>Cancel</UCTableHeaderCell>
              </UCTableRow>
            </UCTableHeader>
            <UCTableBody>
              {leaves.map(([startDate, endDate], index) => {
                const { noOfDays, duration, reason } = parseLeaveDetails(
                  leaveData.leaves[new Date().getFullYear()][startDate],
                );
                return (
                  <UCTableRow key={index}>
                    <UCTableCell>{startDate}</UCTableCell>
                    <UCTableCell>{endDate}</UCTableCell>
                    <UCTableCell>{noOfDays}</UCTableCell>
                    <UCTableCell>{duration}</UCTableCell>
                    <UCTableCell>{reason}</UCTableCell>
                    <UCTableCell>
                      <XMarkIcon
                        title="Delete leave"
                        className="h-4 w-4 cursor-pointer hover:text-red-700"
                        onClick={() => deleteLeave(leaveData.empId, startDate)}
                      />
                    </UCTableCell>
                  </UCTableRow>
                );
              })}
            </UCTableBody>
          </UCTable>
        </UCCard>
      ))} */}
      Hi
    </>
  );
};

export default LeaveList;

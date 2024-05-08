import { useEffect, useState } from "react";
import { getEmployee, deleteLeave } from "@/lib/employeeAction";
import UCCard from "../ui/card";
import UCTable from "../ui/table/table";
import UCTableHeader from "../ui/table/thead";
import UCTableRow from "../ui/table/tr";
import UCTableHeaderCell from "../ui/table/th";
import UCTableBody from "../ui/table/tbody";
import UCTableCell from "../ui/table/td";
import { XMarkIcon } from "@heroicons/react/24/outline";

const LeaveList: React.FC = ({}) => {
  const [leaveData, setLeaveData] = useState<{
    empId: string;
    leaves: Record<string, Record<string, string>>;
  }>({
    empId: "",
    leaves: {},
  });

  useEffect(() => {
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    const employeeData = await getEmployee();
    setLeaveData(employeeData);
  };

  const parseLeaveDetails = (details: string) => {
    const [endDate, type, noOfDays, duration, reason] = details.split("|");
    return { endDate, type, noOfDays, duration, reason };
  };

  const groupedLeaves: Record<string, [string, string, string][]> = {};

  const getEmployeeLeavesByType = () => {
    Object.entries(leaveData.leaves[new Date().getFullYear()] || {}).forEach(
      ([startDate, details]) => {
        const { endDate, type, noOfDays } = parseLeaveDetails(details);
        if (!groupedLeaves[type]) {
          groupedLeaves[type] = [];
        }
        groupedLeaves[type].push([startDate, endDate, noOfDays]);
      }
    );
  };

  getEmployeeLeavesByType();

  return (
    <>
      {Object.entries(groupedLeaves).map(([type, leaves], index) => (
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
                  leaveData.leaves[new Date().getFullYear()][startDate]
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
                        className="h-4 w-4 hover:text-red-700 cursor-pointer"
                        onClick={() => deleteLeave(leaveData.empId, startDate)}
                      />
                    </UCTableCell>
                  </UCTableRow>
                );
              })}
            </UCTableBody>
          </UCTable>
        </UCCard>
      ))}
    </>
  );
};

export default LeaveList;


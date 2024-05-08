import { applyLeave, getAllLeaves, getEmployee } from "@/lib/employeeAction";
import { useEffect, useState } from "react";
import UCDate from "../ui/date";
import UCCheckbox from "../ui/checkbox";
import UCSelect from "../ui/select";
import UCInput from "../ui/input";
import UCCard from "../ui/card";
import UCButton from "../ui/button";
import { any } from "zod";
import toast from "react-hot-toast";

const ApplyLeave: React.FC = ({}) => {
  const [type, setType] = useState("Casual");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState<"half" | "full">("full");
  const [leavesData, setLeavesData] = useState<any[]>([]);

  const currentYear = new Date().getFullYear();

  const getEmployeeData = async () => {
    const x = await getAllLeaves("INEMP123", currentYear.toString());
    setLeavesData(x);
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  const convertDatetoKey = (date: Date) => {
    const key = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    return key;
  };

  const convertStringToDate = (dateString: string) => {
    const year = Number(dateString.slice(0, 4));
    const month = Number(dateString.slice(4, 6)) - 1;
    const day = Number(dateString.slice(6));

    return new Date(year, month, day);
  };

  const validateLeave = () => {
    const startDateKey = convertDatetoKey(startDate);
    const endDateKey = convertDatetoKey(endDate);

    if (startDate > endDate) {
      toast.error("Start date should not be less than end date", {
        duration: 5000,
      });
      console.log("failed");
      return false;
    }

    for (const key in leavesData) {
      console.log(leavesData);
      console.log(leavesData[key]);
      const leaveStartDate = convertStringToDate(leavesData[key].startDate);
      console.log(leaveStartDate);
      console.log(startDate);
      const leaveEndDate = convertStringToDate(leavesData[key].endDate);
      console.log(leaveEndDate);
      console.log(endDate);

      if (
        leavesData[key].startDate === convertDatetoKey(startDate) ||
        leavesData[key].endDate === convertDatetoKey(startDate)
      ) {
        toast.error("Leave already exists for : " + startDateKey, {
          duration: 5000,
        });
        console.log("failed");
        return false;
      } else if (
        (startDate >= leaveStartDate && startDate <= leaveEndDate) ||
        (endDate >= leaveStartDate && endDate <= leaveEndDate)
      ) {
        toast.error(
          "Leave overlaps with existing leave: " +
            type +
            "On Dates : " +
            convertDatetoKey(leaveStartDate) +
            convertDatetoKey(leaveEndDate),
          { duration: 5000 },
        );
        console.log("failed");
        return false;
      }

      return true;
    }
  };

  const validateandapplyLeave = () => {
    // alert("entered");
    if (!validateLeave()) return;

    // const result = applyLeave("INEMP123", [
    //   {
    //     type: type,
    //     start: startDate,
    //     end: endDate,
    //     duration: duration,
    //     reason: reason,
    //   },
    // ]);

    // result.then((data) => {
    //   if (data.success) {
    //     setDuration("full");
    //     setReason("");
    //     setType("Casual");
    //     setStartDate(new Date());
    //     setEndDate(new Date());
    //     toast.success("Leave Applied", { duration: 5000 });
    //   } else {
    //     toast.error("Something went wrong", { duration: 5000 });
    //   }
    // });
  };

  return (
    <form>
      <div className="flex flex-col md:hidden">
        <div className="flex flex-row">
          <div>
            <UCSelect
              options={["Casual", "Optional", "Special"]}
              label="Leave Type"
              onChange={(e) => setType(e.target.value)}
            ></UCSelect>
          </div>
          <div>
            <UCDate
              name="Start Date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            ></UCDate>
          </div>
          <div>
            <UCDate
              name="End Date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
            ></UCDate>
          </div>
        </div>
        <div>
          <UCCheckbox
            value="Half"
            name="Halfday"
            label="Apply for Half a Day"
            onChange={() => setDuration("half")}
          />
        </div>
        <div className="flex flex-row">
          <div className="grow">
            <UCInput
              label="Reason"
              className="w-full"
              onChange={(e) => setReason(e.target.value)}
            ></UCInput>
          </div>
          <div className="content-end">
            {/* <UCButton
              type="button"
              onClick={() => {
                applyLeave("test", [
                  {
                    type: type,
                    start: startDate,
                    end: endDate,
                    duration: duration,
                    reason: reason,
                  },
                ]);
              }}
            >
              Apply Leave
            </UCButton> */}
            <UCButton type="button" onClick={validateandapplyLeave}>
              Apply Leave
            </UCButton>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex flex-col">
          <div className="flex flex-row  content-center justify-center">
            <div className="content-end">
              <UCSelect
                options={["Casual", "Optional", "Special"]}
                label="Leave Type"
                onChange={(e) => setType(e.target.value)}
              ></UCSelect>
            </div>
            <div className="content-end">
              <UCDate
                name="Start Date"
                onChange={(e) => setStartDate(new Date(e.target.value))}
              ></UCDate>
            </div>
            <div className="content-end">
              <UCDate
                name="End Date"
                className="outline-none"
                onChange={(e) => setEndDate(new Date(e.target.value))}
              ></UCDate>
            </div>
            <div className="content-end">
              <UCCheckbox
                value="Half"
                name="Halfday"
                label="Apply for Half a Day"
                onChange={() => setDuration("half")}
              />
            </div>
            <div className="grow content-end">
              <UCInput
                label="Reason"
                className="w-full"
                onChange={(e) => setReason(e.target.value)}
              ></UCInput>
            </div>

            <div className="content-end">
              {/* <UCButton
                type="button"
                onClick={() => {
                  applyLeave("test", [
                    {
                      type: type,
                      start: startDate,
                      end: endDate,
                      duration: duration,
                      reason: reason,
                    },
                  ]);
                }}
              >
                Apply Leave
              </UCButton> */}
              <UCButton type="button" onClick={validateandapplyLeave}>
                Apply Leave
              </UCButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ApplyLeave;

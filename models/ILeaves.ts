export interface Employee{
    empId: string;
    leaves: { [key: string]: { [key: string]: {allotted:string,[key:string]:string} } };
  }
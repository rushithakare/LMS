"use server";
import { Employee } from "@/models/ILeaves";
import dbConnect from "@/store/dbConnect";
import mongoose from "mongoose";

interface Model extends Employee, mongoose.Document {}

const ModelSchema = new mongoose.Schema<Model>({
  empId: {
    type: String,
    // required: [true, "Please provide the creator's ID"],
  },
  leaves: {
    type: mongoose.Schema.Types.Mixed,
    // required: [true, "Please provide the assigned to ID"],
  },
});

const store =
  mongoose.models.Employee || mongoose.model<Model>("Employee", ModelSchema);

// export async function create(data: ITask) {
//   await dbConnect();
//   const c = await store.create(data);
//   console.log(c);
//   return c;
// }

// export async function Update(
//   entity: string,
//   search: any,
//   key: string,
//   data: any,
// ) {
//   let parentNode = await store.findOne(
//     {
//       $and: search,
//     },
//     { [entity]: 1 },
//   );

//   let leafNode = parentNode[entity];
//   leafNode = {
//     ...leafNode,
//     [key]: data,
//   };

//   parentNode[entity] = leafNode;
//   parentNode.markModified(entity);
//   await parentNode.save();
// }
export async function UpdateEx(
  empId: string,
  path: string,
  data: any,
) {
  let root = await store.findOne({
    empId: empId,
  });

  const pathArray = path.split(".");

  const key = pathArray.pop() || "key";
  const node = pathArray.pop() || "node";
  const entityderived = pathArray[0];
  let parent = root;

  pathArray.forEach((element) => {
    parent = parent[element];
  });

  const x = parent[node];
  console.log(x);
  let y = { ...x, [key]: data };
  console.log(y);

  parent[node] = y;

  root.markModified(entityderived);
  await root.save();
}

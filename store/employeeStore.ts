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

export async function Update(
  empId: string,
  path: string,
  data: any,
) {

  await dbConnect();
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

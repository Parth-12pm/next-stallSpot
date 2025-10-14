// models/Document.ts

import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IDocument extends MongoDocument {
  name: string;
  type: "assignment" | "experiment";
  url: string;
  cloudinaryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["assignment", "experiment"], required: true },
    url: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

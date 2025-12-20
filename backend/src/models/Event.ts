import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  images: string[];
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
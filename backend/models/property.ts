import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string;
  furnished: string;
  availableFrom: Date;
  listedBy: string;
  tags: string;
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  createdBy: mongoose.Types.ObjectId;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    areaSqFt: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: { type: String, required: true },
    furnished: { type: String, required: true },
    availableFrom: { type: Date, required: true },
    listedBy: { type: String, required: true },
    tags: { type: String },
    colorTheme: { type: String },
    rating: { type: Number },
    isVerified: { type: Boolean, default: false },
    listingType: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProperty>("Property", propertySchema); 
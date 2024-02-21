import { Convenience } from "./convenience.enum.js";
import { HousingType } from "./housing-type.enum.js";
import { User } from "./user.type.js";

export type RentalOffer = {
   title: string;
   description: string;
   createdDate: Date;
   city: string;
   previewImage: string;
   images: string[];
   premium: boolean;
   favorite: boolean;
   rating: number;
   type: HousingType;
   roomsCount: number;
   guestsCount: number;
   price: number;
   conveniences: Convenience[];
   authorOffer: User;
   commentsCount: number;
   coordinats: [number, number]
}
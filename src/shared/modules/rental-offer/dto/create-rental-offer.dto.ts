import { Convenience, HousingType } from "../../../types/index.js";

export class CreateRentalOfferDto {
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
    authorOfferId: string;
    commentsCount: number;
    coordinats: [number, number]
}
import { Convenience, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  createdDate: Date;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  favorite: boolean;
  rating: number;
  type: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  conveniences: Convenience[];
  authorOfferId: string;
  commentsCount: number;
  coordinats: [number, number];
}

import { Convenience, HousingType, UserType } from '../types/index.js';
import { Offer } from '../types/offer.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    createdDate,
    city,
    previewImage,
    images,
    premium,
    favorite,
    rating,
    type,
    roomsCount,
    guestsCount,
    price,
    conveniences,
    name,
    email,
    avatarPath,
    password,
    userType,
    commentsCount,
    coordinats
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatarPath,
    password,
    type: userType as UserType
  };

  return {
    title,
    description,
    createdDate: new Date(createdDate),
    city,
    previewImage,
    images: images.split(';'),
    premium: Boolean(premium),
    favorite: Boolean(favorite),
    rating: Number.parseFloat(rating),
    type: type as HousingType,
    roomsCount: Number.parseInt(roomsCount, 10),
    guestsCount: Number.parseInt(guestsCount, 10),
    price: Number.parseFloat(price),
    conveniences: conveniences.split(';')
      .map((convenience) => convenience as Convenience),
    authorOffer: user,
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinats: [Number.parseFloat(coordinats.split(';')[0]), Number.parseFloat(coordinats.split(';')[1])]
  };
}

import { City, Good, HousingType, UserType } from '../types/index.js';
import { Offer } from '../types/offer.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    city,
    previewImage,
    images,
    isPremium,
    type,
    bedrooms,
    maxAdults,
    price,
    goods,
    name,
    email,
    avatarUrl,
    password,
    userType,
    coordinats
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatarUrl,
    password,
    type: userType as UserType
  };

  return {
    title,
    description,
    city: city as City,
    previewImage,
    images: images.split(';'),
    isPremium: Boolean(isPremium),
    isFavorite: false,
    rating: 0,
    type: type as HousingType,
    bedrooms: Number.parseInt(bedrooms, 10),
    maxAdults: Number.parseInt(maxAdults, 10),
    price: Number.parseFloat(price),
    goods: goods.split(';')
      .map((good) => good as Good),
    host: user,
    commentsCount: 0,
    location: [Number.parseFloat(coordinats.split(';')[0]),Number.parseFloat(coordinats.split(';')[1])]
  };
}

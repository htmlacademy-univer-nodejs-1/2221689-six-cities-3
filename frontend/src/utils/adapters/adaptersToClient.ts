import { CityLocation, SixCities, UserType } from "../../const";
import CommentDto from "../../dto/comment/comment.dto";
import FullOfferDto from "../../dto/offer/full-offer.dto";
import OfferDto from "../../dto/offer/offer.dto";
import UserDto from "../../dto/user/user.dto";
import { City, CityName, Comment, Offer, Type, User } from "../../types/types";

export const adaptOffersToClient =
  (offers: OfferDto[]): Offer[] =>
    offers
      .map((offer: OfferDto) => ({
        id: offer.id,
        title: offer.title,
        city: adaptCityForOfferToClient(offer.city),
        isPremium: offer.isPremium,
        isFavorite: offer.isFavorite,
        rating: offer.rating,
        previewImage: offer.previewImage,
        type: offer.type as Type,
        price: offer.price,
        location: adaptCityForOfferToClient(offer.city).location,
        bedrooms: 0,
        description: 'cool apartment',
        goods: [],
        host: {} as User,
        images: [],
        maxAdults: 0
      }));

export const adaptFullOfferToClient =
  (offer: FullOfferDto): Offer =>
  ({
    id: offer.id,
    title: offer.title,
    city: adaptCityForOfferToClient(offer.city),
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    rating: offer.rating,
    previewImage: offer.previewImage,
    type: offer.type as Type,
    price: offer.price,
    location: adaptCityForOfferToClient(offer.city).location,
    bedrooms: offer.bedrooms,
    description: offer.description,
    goods: offer.goods as string[],
    host: adaptUserToClient(offer.host),
    images: offer.images,
    maxAdults: offer.maxAdults
  });

export const adaptCommentToClient =
  (comment: CommentDto): Comment => ({
    id: comment.id,
    comment: comment.comment,
    date: comment.postDate,
    rating: comment.rating,
    user: adaptUserToClient(comment.host)
  })


const adaptUserToClient =
  (user: UserDto): User => {
    return {
      name: user.name,
      avatarUrl: user.avatarUrl,
      isPro: user.type === UserType.Pro,
      email: user.email
    }
  }

const adaptCityForOfferToClient =
  (city: SixCities): City => {
    return {
      name: city as CityName,
      location: {
        latitude: CityLocation[city as CityName].latitude,
        longitude: CityLocation[city as CityName].longitude
      }
    }
  }

export const adaptCommentsToClient =
  (comments: CommentDto[]): Comment[] =>
    comments.map((comment: CommentDto) => ({
      id: comment.id,
      comment: comment.comment,
      date: comment.postDate,
      rating: comment.rating,
      user: adaptUserToClient(comment.host)
    })
  )




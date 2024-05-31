import { SixCities, HousingType } from "../../const";

export default class OfferDto {
  public id!: string;

  public title!: string;

  public city!: SixCities;

  public previewImage!: string;

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public createdAt!: string;

  public type!: HousingType;

  public price!: number;

  public rating!: number;

  public commentsCount!: number;
}
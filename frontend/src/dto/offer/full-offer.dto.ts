import { SixCities, Good, HousingType } from "../../const";
import UserDto from "../user/user.dto";

export default class FullOfferDto {
    public id!: string;
  
    public title!: string;
  
    public description!: string;
  
    public city!: SixCities;
  
    public createdAt!: string;
  
    public previewImage!: string;
  
    public images!: string[];
  
    public isPremium!: boolean;
  
    public isFavorite!: boolean;
  
    public rating!: number;
  
    public type!: HousingType;
  
    public bedrooms!: number;
  
    public maxAdults!: number;
  
    public price!: number;
  
    public goods!: Good[];
  
    public host!: UserDto;
  
    public location!: [number, number];
  
    public commentsCount!: number;
  }
  
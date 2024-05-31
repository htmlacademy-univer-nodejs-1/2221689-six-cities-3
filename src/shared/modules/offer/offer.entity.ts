import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, Good, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
    @prop({ required: true, trim: true, type: () => String })
  public title: string;

    @prop({ required: true, trim: true, type: () => String })
    public description: string;

    @prop({
      required: true,
      type: () => String,
      enum: City
    })
    public city: City;

    @prop({ required: true, type: () => String })
    public previewImage: string;

    @prop({ required: true, default: [], type: () => Array<string> })
    public images: string[];

    @prop({ required: true, default: false, type: () => Boolean })
    public isPremium: boolean;

    @prop({ required: true, default: false, type: () => Boolean })
    public isFavorite: boolean;

    @prop({ required: true, default: 0, type: () => Number })
    public rating: number;

    @prop({
      required: true,
      type: () => String,
      enum: HousingType
    })
    public type: HousingType;

    @prop({ required: true, type: () => Number })
    public bedrooms: number;

    @prop({ required: true, type: () => Number })
    public maxAdults: number;

    @prop({ required: true, type: () => Number })
    public price: number;

    @prop({
      required: true,
      type: () => Array<Good>
    })
    public goods: Good[];

    @prop({
      ref: UserEntity,
      required: true
    })
    public host: Ref<UserEntity>;

    @prop({ required: false, default: 0, type: () => Number })
    public commentsCount: number;

    @prop({ required: true, type: () => Array<number> })
    public location: [number, number];
}

export const OfferModel = getModelForClass(OfferEntity);

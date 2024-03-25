import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Convenience, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface RentalOfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'rentalOffers'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RentalOfferEntity extends defaultClasses.TimeStamps {
    @prop({ required: true, trim: true, type: () => String })
  public title: string;

    @prop({ required: true, trim: true, type: () => String })
    public description: string;

    @prop({ required: true, type: () => String })
    public createdDate: Date;

    @prop({ required: true, type: () => String })
    public city: string;

    @prop({ required: true, type: () => String })
    public previewImage: string;

    @prop({ required: true, type: () => Array<string> })
    public images: string[];

    @prop({ required: true, default: false, type: () => Boolean })
    public premium: boolean;

    @prop({ required: true, default: false, type: () => Boolean })
    public favorite: boolean;

    @prop({ required: true, type: () => Number })
    public rating: number;

    @prop({
      required: true,
      type: () => String,
      enum: HousingType
    })
    public type: HousingType;

    @prop({ required: true, type: () => Number })
    public roomsCount: number;

    @prop({ required: true, type: () => Number })
    public guestsCount: number;

    @prop({ required: true, type: () => Number })
    public price: number;

    @prop({
      required: true,
      type: () => Array<Convenience>
    })
    public conveniences: Convenience[];

    @prop({
      ref: UserEntity,
      required: true
    })
    public authorOfferId: Ref<UserEntity>;

    @prop({ required: false, default: 0, type: () => Number })
    public commentsCount: number;

    @prop({ required: true, type: () => Array<number> })
    public coordinats: [number, number];
}

export const RentalOfferModel = getModelForClass(RentalOfferEntity);

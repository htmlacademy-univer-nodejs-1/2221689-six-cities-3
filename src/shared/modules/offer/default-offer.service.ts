import { inject, injectable } from 'inversify';
import { City, Component, SortType } from '../../types/index.js';
import { CreateOfferDto, OfferEntity, OfferService, UpdateOfferDto } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { CommentEntity } from '../comment/comment.entity.js';


@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate('host')
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .find()
      .limit(limit)
      .sort({ createdAt: SortType.Down })
      .populate('host')
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('host')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentsCount: 1,
        }
      }).exec();
  }

  public async findPremium(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city as City, isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(PREMIUM_OFFER_COUNT)
      .populate('host')
      .exec();
  }

  public async findFavorite(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ isFavorite: true })
      .populate('host')
      .exec();
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const newRating = await this.commentModel
      .aggregate([{
        $match: {
          $expr: {
            $eq: [
              {
                $toObjectId: offerId
              },
              '$offerId'
            ]
          }
        }},
      {
        $group: {
          _id: null,
          avg: { '$avg': '$rating' }
        }
      }
      ]).exec();
    return this.offerModel
      .findByIdAndUpdate(offerId, { rating: newRating[0].avg }, { new: true })
      .populate('host')
      .exec();
  }

  public async exists(documentId: string): Promise < boolean > {
    return(await this.offerModel
      .exists({ _id: documentId })) !== null;
  }
}

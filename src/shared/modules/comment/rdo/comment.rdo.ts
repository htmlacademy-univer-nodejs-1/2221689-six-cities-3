import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { FullOfferRdo } from '../../offer/index.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public comment: string;

  @Expose()
  public rating: number;

  @Expose()
  @Type(() => FullOfferRdo)
  public offerId: FullOfferRdo;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public host: UserRdo;
}

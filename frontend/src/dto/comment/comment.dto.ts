import FullOfferDto from "../offer/full-offer.dto";
import UserDto from "../user/user.dto";

export default class CommentDto {
    public id!: string;
  
    public comment!: string;
  
    public rating!: number;
  
    public offerId!: FullOfferDto;
  
    public postDate!: string;
  
    public host!: UserDto;
}
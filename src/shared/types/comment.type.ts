import { User } from './user.type.js';

export type Comment = {
    text: string;
    createdDate: Date;
    rating: number;
    authorOffer: User
}

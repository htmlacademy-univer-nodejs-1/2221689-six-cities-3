import { DocumentType } from '@typegoose/typegoose';
import { CreateRentalOfferDto, RentalOfferEntity } from './index.js';


export interface RentalOfferService {
  create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
}

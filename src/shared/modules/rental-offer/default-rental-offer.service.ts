import { inject, injectable } from "inversify";
import { Component } from "../../types/index.js";
import { CreateRentalOfferDto, RentalOfferEntity, RentalOfferService } from "./index.js";
import { Logger } from "../../libs/logger/index.js";
import { DocumentType, types } from "@typegoose/typegoose";


@injectable()
export class DefaultRentalOfferService implements RentalOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.RentalOfferModel) private readonly rentalOfferModel: types.ModelType<RentalOfferEntity>
  ) {}

  public async create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>> {
    const result = await this.rentalOfferModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null> {
    return this.rentalOfferModel.findById(offerId).exec();
  }
}
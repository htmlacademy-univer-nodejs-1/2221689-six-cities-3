import { Container } from "inversify";
import { DefaultRentalOfferService, RentalOfferEntity, RentalOfferModel, RentalOfferService } from "./index.js";
import { types } from "@typegoose/typegoose";
import { Component } from "../../types/index.js";

export function createOfferContainer() {
    const offerContainer = new Container();
  
    offerContainer.bind<RentalOfferService>(Component.RentalOfferService).to(DefaultRentalOfferService);
    offerContainer.bind<types.ModelType<RentalOfferEntity>>(Component.RentalOfferModel).toConstantValue(RentalOfferModel);
  
    return offerContainer;
  }
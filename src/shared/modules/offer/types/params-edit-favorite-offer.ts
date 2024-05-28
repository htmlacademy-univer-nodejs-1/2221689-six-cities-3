import { ParamsDictionary } from 'express-serve-static-core';

export type ParamEditFavoriteOffer = {
  offerId: string;
  status: string;
} | ParamsDictionary;

import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestQuery, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { FullOfferRdo } from './rdo/full-offer.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { ParamOfferId } from './types/param-offer-id.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { ParamEditFavoriteOffer } from './types/params-edit-favorite-offer.js';
import { UserService } from '../user/user-service.interface.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for Offer Controller…');

    this.addRoute({ path: '/offers', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavorite,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.editFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/comments/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async index({ query, tokenPayload }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.find(query.limit);
    if (tokenPayload) {
      const user = await this.userService.findById(tokenPayload.id);
      if (user) {
        offers.map((offer) => {
          if (user.favoriteOffers.includes(offer.id)) {
            offer.isFavorite = true;
          }
        });
      }
    }
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authorized',
        'OfferController'
      );
    }
    const result = await this.offerService.create({ ...body, host: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(FullOfferRdo, offer));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    if (tokenPayload) {
      const user = await this.userService.findById(tokenPayload.id);
      if (user && offer && user.favoriteOffers.includes(offerId)) {
        offer.isFavorite = true;
      }
    }
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async update({ body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authorized',
        'OfferController'
      );
    }
    const offer = await this.offerService.findById(params.offerId);
    if (offer && tokenPayload.id !== offer.host.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'User has not rigths to update this offer',
        'OfferController'
      );
    }
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    const user = await this.userService.findById(tokenPayload.id);
    if (user && updatedOffer && user.favoriteOffers.includes(updatedOffer.id)) {
      updatedOffer.isFavorite = true;
    }
    this.ok(res, fillDTO(FullOfferRdo, updatedOffer));
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not authorized',
        'OfferController'
      );
    }
    const offer = await this.offerService.findById(params.offerId);
    if (offer && tokenPayload.id !== offer.host.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'User has not rigths to delete this offer',
        'OfferController'
      );
    }
    const { offerId } = params;
    const deletedOffer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, deletedOffer);
  }

  public async getPremium({ query, tokenPayload }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    if (!query.city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Сity for offers is not specified',
        'OfferController'
      );
    }
    const offers = await this.offerService.findPremium(query.city);
    if (tokenPayload) {
      const user = await this.userService.findById(tokenPayload.id);
      if (user) {
        offers.map((offer) => {
          if (user.favoriteOffers.includes(offer.id)) {
            offer.isFavorite = true;
          }
        });
      }
    }
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavorite({ tokenPayload }: Request, _res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const favoriteOffers: DocumentType<OfferEntity>[] = [];
    if (tokenPayload) {
      const user = await this.userService.findById(tokenPayload.id);
      if (user) {
        for (let i = 0; i < offers.length; i++) {
          if (user.favoriteOffers.includes(offers[i].id)) {
            offers[i].isFavorite = true;
            favoriteOffers.push(offers[i]);
          }
        }
      }
    }
    this.ok(_res, fillDTO(OfferRdo, favoriteOffers));
  }

  public async editFavorite({ params, tokenPayload }: Request<ParamEditFavoriteOffer>, res: Response): Promise<void> {
    const { offerId, status } = params;
    if (tokenPayload) {
      const user = await this.userService.findById(tokenPayload.id);
      const offer = await this.offerService.findById(offerId);
      if (offer) {
        offer.isFavorite = Boolean(Number(status));
      }
      if (user) {
        if (Number(status)) {
          user.favoriteOffers.push(offerId);
        } else {
          user.favoriteOffers = user.favoriteOffers.filter((favoriteOfferId) => offerId !== favoriteOfferId);
        }
        await this.userService.updateById(user.id, { favoriteOffers: user.favoriteOffers });
      }
      this.ok(res, fillDTO(FullOfferRdo, offer));
    }

  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}

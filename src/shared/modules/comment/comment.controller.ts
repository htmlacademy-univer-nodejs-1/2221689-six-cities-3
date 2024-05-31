import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService, CreateCommentDto, CreateCommentRequest } from './index.js';
import { OfferService } from '../offer/index.js';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { UserService } from '../user/user-service.interface.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.CommentService) private readonly commentService: CommentService,
        @inject(Component.OfferService) private readonly offerService: OfferService,
        @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/offers/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async create(
    { body, params, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const { offerId } = params;

    if (! await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }

    if (! await this.userService.findById(body.userId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${offerId} not found.`,
        'CommentController'
      );
    }

    if (offerId !== body.offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Offers ${offerId} and ${body.offerId} not equals.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({ ...body, userId: tokenPayload.id });
    await this.offerService.incCommentCount(offerId);
    await this.offerService.updateRating(offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}

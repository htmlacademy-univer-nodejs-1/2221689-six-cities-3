import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { CheckStatusUserDto } from '../dto/check-status-user.dto.js';

export type CheckStatusUserRequest = Request<RequestParams, RequestBody, CheckStatusUserDto>;

import * as _                from 'underscore';
import {
  Request,
  RequestAPI,
  CoreOptions,
  RequiredUriUrl,
}                            from 'request';
import * as request          from 'request-promise';

import * as sbase            from '@nodeswork/sbase';

import { AppletInfoService } from './applet.info.service';
import { constants }         from '../constants';

const PROXY_HOST   = 'http://proxy-container';
const NAM          = 'nam';
const GET_METHOD   = { method: 'GET' };
const POST_METHOD  = { method: 'POST' };

export class RequestService {

  private defaultRequest: RequestAPI<Request, CoreOptions, RequiredUriUrl>;

  constructor(
    private appletInfo: AppletInfoService,
  ) {
    const info = this.appletInfo.getAppletInfo();
    const headers: any = {};
    headers[constants.headers.request.APPLET_ID]        = info.appletId;
    headers[constants.headers.request.APPLET_TOKEN]     = info.appletToken;
    headers[constants.headers.request.NA_TYPE]          = info.naType;
    headers[constants.headers.request.NA_VERSION]       = info.naVersion;
    headers[constants.headers.request.PACKAGE_NAME]     = info.packageName;
    headers[constants.headers.request.PACKAGE_VERSION]  = info.packageVersion;

    headers[sbase.constants.headers.request.NODESWORK_FORWARDED_TO] = NAM;

    this.defaultRequest = request.defaults({
      headers,
      proxy: PROXY_HOST,
    });
  }

  async request(options: RequestOptions): Promise<any> {
    return this.defaultRequest(options);
  }

  async get(options: RequestOptions): Promise<any> {
    return this.request(_.extend({}, options, GET_METHOD));
  }

  async post(options: RequestOptions): Promise<any> {
    return this.request(_.extend({}, options, POST_METHOD));
  }
}

export interface RequestOptions {
  uri:       string;
  method:    string;
  headers?:  any;
  body?:     any;
}

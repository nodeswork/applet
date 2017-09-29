import * as _                from 'underscore';
import {
  Request,
  RequestAPI,
  CoreOptions,
  RequiredUriUrl,
}                            from 'request';
import * as request          from 'request-promise';
import * as url              from 'url';

import * as logger           from '@nodeswork/logger';
import * as kiws             from '@nodeswork/kiws';
import * as sbase            from '@nodeswork/sbase';
import { NodesworkError }    from '@nodeswork/utils';

import { AppletInfoService } from './applet.info.service';
import { constants }         from '../constants';

const PROXY_HOST   = 'http://nodeswork-container-proxy:28320';
const NAM          = 'nam';
const GET_METHOD   = { method: 'GET' };
const POST_METHOD  = { method: 'POST' };
const LOG          = logger.getLogger();

@kiws.Service()
export class RequestService {

  private defaultRequest: RequestAPI<Request, CoreOptions, RequiredUriUrl>;

  constructor(
    private appletInfo: AppletInfoService,
  ) {
    const info = this.appletInfo.getAppletInfo();

    if (info.appletId == null) {
      LOG.error('Applet id is missing, try set NW_APPLET_ID from env');
      throw new NodesworkError(
        'Applet id is missing, try set NW_APPLET_ID from env',
      );
    }

    if (info.appletToken == null) {
      LOG.error('Applet token is missing, try set NW_APPLET_TOKEN from env');
      throw new NodesworkError(
        'Applet token is missing, try set NW_APPLET_TOKEN from env',
      );
    }

    const headers: any = {};
    headers[constants.headers.request.APPLET_ID]        = info.appletId;
    headers[constants.headers.request.APPLET_TOKEN]     = info.appletToken;
    headers[constants.headers.request.NA_TYPE]          = info.naType;
    headers[constants.headers.request.NA_VERSION]       = info.naVersion;
    headers[constants.headers.request.PACKAGE_NAME]     = info.packageName;
    headers[constants.headers.request.PACKAGE_VERSION]  = info.packageVersion;

    headers[sbase.constants.headers.request.NODESWORK_FORWARDED_TO] = NAM;

    const defaults: any = {
      headers,
      json: true,
    };

    if (info.env === 'production') {
      defaults.proxy = PROXY_HOST;
    }

    this.defaultRequest = request.defaults(defaults);
    LOG.info('Set default request', defaults);
  }

  async request(options: RequestOptions): Promise<any> {
    const uri = new url.URL(options.uri, 'http://localhost:28310');
    const requestOptions = _.extend(options, {
      uri: uri.toString(),
    });
    LOG.info('Send request', requestOptions);
    try {
      return await this.defaultRequest(requestOptions);
    } catch (e) {
      LOG.error('Got error from request', e);
      throw e;
    }
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

import * as _             from 'underscore';

import * as kiws          from '@nodeswork/kiws';
import { NodesworkError } from '@nodeswork/utils';

import { Account }        from '../account';
import { RequestService } from '../services';
import { constants }      from '../constants';

const ACCOUNT_OPERATE_OPTIONS_DEFAULTS: object = {
  method:   'GET',
  headers:  {},
  args:     [],
};

@kiws.Injectable({})
export class BaseAccount {

  _id:              string;
  accountType:      string;
  accountToken:     string;
  provider:         string;
  name:             string;
  verified:         boolean;
  accountCategory:  AccountCategory;

  $tracker:         OperateTracker;

  constructor(
    protected $request: RequestService,
  ) {}

  public setTracker(tracker: OperateTracker) {
    this.$tracker = tracker;
  }

  public async $operate(options: AccountOperateOptions): Promise<any> {
    _.defaults(options, ACCOUNT_OPERATE_OPTIONS_DEFAULTS);

    const headers = _.extend({}, options.headers);

    headers[constants.headers.request.ACCOUNT_ID]     = this._id;
    headers[constants.headers.request.ACCOUNT_TOKEN]  = this.accountToken;
    try {
      const result = await this.$request.request({
        uri:     `/accounts/${this._id}/operate`,
        method:  'POST',
        headers,
        body:    {
          ref:    options.ref,
          method: options.method,
          body:   options.body,
          query:  options.query,
        },
      });
      if (this.$tracker != null) {
        await this.$tracker.track(options, null, result);
      }
      return result;
    } catch (e) {
      if (e.statusCode === 424) {
        e = new NodesworkError(e.error.remoteError.message, {
          responseCode: e.error.remoteError.statusCode,
        });
      }
      if (this.$tracker != null) {
        await this.$tracker.track(options, e);
      }
      throw e;
    }
  }
}

export interface OperateTracker {
  track(options: AccountOperateOptions, err: any, result?: any): Promise<void>;
}

export interface AccountCategory {
  accountType: string;
  provider:    string;
  name:        string;
  imageUrl:    string;
}

export interface AccountOperateOptions {
  ref:       string;
  method?:   string;
  headers?:  any;
  query?:    { [name: string]: string };
  body?:     any;
}

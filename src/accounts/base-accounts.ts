import * as _             from 'underscore';

import * as kiws          from '@nodeswork/kiws';

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

  constructor(
    protected $request: RequestService,
  ) {}

  public async $operate(options: AccountOperateOptions): Promise<any> {
    _.defaults(options, ACCOUNT_OPERATE_OPTIONS_DEFAULTS);

    const headers = _.extend({}, options.headers);

    headers[constants.headers.request.ACCOUNT_ID]     = this._id;
    headers[constants.headers.request.ACCOUNT_TOKEN]  = this.accountToken;
    return await this.$request.request({
      uri:     `/accounts/${this._id}/operate`,
      method:  'POST',
      headers,
      body:    {
        ref:    options.ref,
        method: options.method,
        body:   options.body,
      },
    });
  }
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

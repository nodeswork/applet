import * as _             from 'underscore';

import * as request       from 'request-promise';

import { BaseAccount }    from '../base-accounts';
import { Account }        from '../../account';
import { RequestService } from '../../services';

@Account({
  accountType:  'KrakenAccount',
  provider:     'kraken',
})
export class KrakenAccount extends BaseAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }

  public async getBalance(): Promise<kraken.AccountBalance> {
    return (await this.$operate({
      name:    'getBalance',
      ref:     'Balance',
      method:  'GET',
    })).result;
  }
}

export namespace kraken {

  export interface AccountBalance {
    [name: string]: string;
  }
}

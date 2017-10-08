import * as _          from 'underscore';
import * as Router     from 'koa-router';

import {
  InputProvider,
  InputGenerator,
  RawInput,
}                      from '@nodeswork/kiws';

import { BaseAccount } from './base-accounts';

const ACCOUNT_TYPES = [
  {
    accountType: 'OAuthAccount',
    provider:    'twitter',
    type:        'TwitterAccount',
  },
  {
    accountType: 'FifaFut18Account',
    provider:    'fifa-fut-18',
    type:        'FifaFut18Account',
  },
];

@InputProvider({})
export class AccountInputProvider {

  @InputGenerator()
  private getAccounts(ctx: Router.IRouterContext): RawInput[] {
    const accounts: BaseAccount[] = ctx.request.body.accounts;
    const inputs: RawInput[] = _
      .chain(accounts)
      .map((account) => {
        let type = _.find(ACCOUNT_TYPES, (accountType) => {
          return account.accountType === accountType.accountType &&
            account.provider === accountType.provider;
        });
        return {
          type: type && type.type,
          data: account,
        };
      })
      .filter((input) => input.type != null)
      .value();
    return inputs;
  }
}

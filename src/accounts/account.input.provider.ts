import * as _      from 'underscore';
import * as Router from 'koa-router';

import {
  InputProvider,
  InputGenerator,
  RawInput,
}                  from '@nodeswork/kiws';

import { Account } from './accounts';

@InputProvider({})
export class AccountInputProvider {

  @InputGenerator()
  private getAccounts(ctx: Router.IRouterContext): RawInput[] {
    const accounts: Account[] = ctx.request.body.accounts;
    const inputs: RawInput[] = _
      .chain(accounts)
      .filter((account) => account.accountType === 'OAuthAccount')
      .filter((account) => account.provider === 'twitter')
      .map((account) => {
        switch (account.provider) {
          case 'twitter':
            return {
              type: 'TwitterAccount',
              data: account,
            };
          default:
            return {
              type: 'OAuthAccount',
              data: account,
            };
        }
      })
      .value();
    return inputs;
  }
}

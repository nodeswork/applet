import { Account }      from '../account';
import { BaseAccount } from './base-accounts';

@Account({
  accountType: 'FifaFut18Account',
  provider:    'fifa-fut-18',
})
export class FifaFut18Account extends BaseAccount {

  public async getCredits(): Promise<any> {

    return await this.$operate({
      ref:     'user/credits',
      method:  'GET',
    });
  }
}

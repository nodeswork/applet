import { Account }        from '../account';
import { BaseAccount }    from './base-accounts';
import { RequestService } from '../services';

@Account({
  accountType: 'FifaFut18Account',
  provider:    'fifa-fut-18',
})
export class FifaFut18Account extends BaseAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }

  public async getUserMassInfo(): Promise<any> {

    return await this.$operate({
      ref:     'ut/game/fifa18/usermassinfo',
      method:  'GET',
    });
  }

  public async getTradePile(): Promise<any> {
    return await this.$operate({
      ref:     'ut/game/fifa18/tradepile',
      method:  'GET',
    });
  }
}

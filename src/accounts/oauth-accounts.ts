import { BaseAccount }    from './base-accounts';
import { Account }        from '../account';
import { RequestService } from '../services';

@Account({
  accountType:  'OAuthAccount',
  provider:     'customized',
})
export class OAuthAccount extends BaseAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }
}

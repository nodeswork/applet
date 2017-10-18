import { OAuthAccount }   from './oauth-accounts';
import { RequestService } from '../services';
import { Account }        from '../account';

@Account({
  accountType:  'OAuthAccount',
  provider:     'twitter',
})
export class TwitterAccount extends OAuthAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }

  public tweet(options: TweetOptions): Promise<Tweet> {
    return this.$operate({
      name:    'tweet',
      ref:     'statuses/update.json',
      method:  'POST',
      body:    options,
    });
  }
}

export interface TweetOptions {
  status: string;
}

export interface Tweet {
}

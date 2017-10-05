import { OAuthAccount } from './oauth-accounts';
import { Account }      from '../account';

@Account({
  accountType:  'OAuthAccount',
  provider:     'twitter',
})
export class TwitterAccount extends OAuthAccount {

  public tweet(options: TweetOptions): Promise<Tweet> {
    return this.$operate({
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

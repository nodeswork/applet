import { OAuthAccount } from './oauth-accounts';

export class TwitterAccount extends OAuthAccount {

  public tweet(options: TweetOptions): Promise<Tweet> {
    return this.$operate({
      ref:     'statuses/update',
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

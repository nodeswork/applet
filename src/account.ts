import 'reflect-metadata';

import * as _    from 'underscore';

import * as kiws from '@nodeswork/kiws';

const ACCOUNT_PROVIDER_TAGS = [ 'account', 'provider' ];
const WORKER_METADATA_KEY  = kiws.ENDPOINT_METADATA_KEY;

export function Account(options: AccountOptions) {
  const tags = _.union(ACCOUNT_PROVIDER_TAGS, options.tags);
  const meta = _.extend({}, options.meta);
  if (options.accountType) {
    meta.accountType = options.accountType;
  }
  if (options.provider) {
    meta.provider = options.provider;
  }
  return kiws.Injectable(_.extend({}, options, { tags }, meta));
}

export interface AccountOptions {
  tags?:        string[];
  meta?:        object;
  accountType:  string;
  provider:     string;
}

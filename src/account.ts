import 'reflect-metadata';

import * as _    from 'underscore';

import * as kiws from '@nodeswork/kiws';

const ACCOUNT_PROVIDER_TAGS = [ 'account', 'provider' ];
const WORKER_METADATA_KEY  = kiws.ENDPOINT_METADATA_KEY;

export function Account(options: AccountOptions) {
  const tags               = _.union(ACCOUNT_PROVIDER_TAGS, options.tags);
  const meta               = _.extend({}, options.meta);
  meta.accountType         = options.accountType;
  meta.provider            = options.provider;
  const injectableOptions  = _.extend({}, options, { tags }, { meta });
  return kiws.Injectable(injectableOptions);
}

export interface AccountOptions {
  tags?:        string[];
  meta?:        object;
  accountType:  string;
  provider:     string;
}

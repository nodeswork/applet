import * as _      from 'underscore';

import * as kiws   from '@nodeswork/kiws';
import * as logger from '@nodeswork/logger';

const LOG = logger.getLogger();

@kiws.Injectable({ inputs: true })
export class ContextLogger {

  @kiws.Inject() context: kiws.ContextInput;

  meta: any = {};

  constructor() { }

  @kiws.PostConstruct()
  init() {
    this.withMeta({ _requestId: this.context.requsetId });
  }

  withMeta(meta: any) {
    _.extend(this.meta, meta);
  }

  debug(message: string, meta?: any) {
    LOG.debug(message, _.extend({}, this.meta, meta));
  }

  verbose(message: string, meta?: any) {
    LOG.verbose(message, _.extend({}, this.meta, meta));
  }

  info(message: string, meta?: any) {
    LOG.info(message, _.extend({}, this.meta, meta));
  }

  warn(message: string, meta?: any) {
    LOG.warn(message, _.extend({}, this.meta, meta));
  }

  error(message: string, meta?: any) {
    LOG.error(message, _.extend({}, this.meta, meta));
  }
}

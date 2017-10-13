import * as _            from 'underscore';
import * as kiws         from '@nodeswork/kiws';

import { bootstrap }     from './bootstrap';
import * as accounts     from './accounts';
import * as applet       from '.';
import { ContextLogger } from './providers';

@applet.WorkerProvider()
class MyWorker {

  @kiws.Input() twitter: applet.TwitterAccount;
  @kiws.Inject() logger: ContextLogger;

  @applet.Worker({})
  async work() {
    // await this.twitter.tweet({
      // status: 'hello world',
    // });
    return {
      status:   'ok',
      twitter:  this.twitter,
      logger:   this.logger,
    };
  }
}

@applet.Module({
  workers: [
    MyWorker,
  ],
  providers: [
    accounts.TwitterAccount,
  ],
})
class MyModule {
}

bootstrap(MyModule);

import * as kiws     from '@nodeswork/kiws';

import { bootstrap } from './bootstrap';

import * as applet   from '.';

@applet.WorkerProvider()
class MyWorker {

  @kiws.Input() twitter: applet.TwitterAccount;

  @applet.Worker({})
  async work() {
    await this.twitter.tweet({
      status: 'hello world',
    });
    return {
      status: 'ok',
      twitter: this.twitter,
    };
  }
}

@applet.Module({
  workers: [
    MyWorker,
  ],
})
class MyModule {
}

bootstrap(MyModule);

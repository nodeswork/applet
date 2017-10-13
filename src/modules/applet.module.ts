import * as kiws           from '@nodeswork/kiws';

import { Module }          from '../module';
import {
  AppletInfoService,
  RequestService,
}                          from '../services';
import {
  AppletServiceStats,
}                          from '../handlers';
import {
  AccountInputProvider,
}                          from '../accounts';
import {
  AppletHeadersMiddleware,
}                          from '../middlewares';
import {
  ContextLogger,
  ExecutionMetrics,
}                          from '../providers';

@Module({
  handlers: [
  ],
  inputs: [
    AccountInputProvider,
  ],
  workers: [
  ],
  providers: [
    AppletInfoService,
    RequestService,
    {
      provide:   kiws.SERVICE_STATS_PROVIDER,
      useClass:  AppletServiceStats,
      multi:     true,
    },
    {
      provide:   kiws.MIDDLEWARE,
      useClass:  AppletHeadersMiddleware,
      multi:     true,
    },
    ContextLogger,
    ExecutionMetrics,
  ],
})
export class AppletModule {
}

import * as kiws              from '@nodeswork/kiws';

import { Module }             from '../module';
import { AppletInfoService }  from '../services';
import {
  AppletServiceStats,
  RegisterAppletInfoHandler,
}                             from '../handlers';
import {
  AccountInputProvider,
  OAuthAccount,
  TwitterAccount,
}                             from '../accounts';

@Module({
  handlers: [
    RegisterAppletInfoHandler,
  ],
  inputs: [
    AccountInputProvider,
  ],
  providers: [
    AppletInfoService,
    OAuthAccount,
    TwitterAccount,
    {
      provide:   kiws.SERVICE_STATS_PROVIDER,
      useClass:  AppletServiceStats,
      multi:     true,
    }
  ],
})
export class AppletModule {
}

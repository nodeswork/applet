import * as os               from 'os';
import * as Koa              from 'koa';

import * as kiws             from '@nodeswork/kiws';
import * as sbase            from '@nodeswork/sbase';

import { AppletInfoService } from '../services';

const respConstants = sbase.constants.headers.response;

@kiws.MiddlewareProvider()
export class AppletHeadersMiddleware {

  private producer: string;
  private hostname: string = os.hostname();

  constructor(
    private appletInfo: AppletInfoService,
  ) {
    const info = this.appletInfo.getAppletInfo();
    this.producer = `na-npm-${info.packageName}_${info.packageVersion}`;
  }

  @kiws.AppMiddleware()
  private async setAppletHeader(ctx: Koa.Context, next: () => void) {
    ctx.set(respConstants.NODESWORK_HEADER_PRODUCER, this.producer);
    ctx.set(respConstants.NODESWORK_HEADER_PRODUCER_HOST, this.hostname);
    await next();
  }
}

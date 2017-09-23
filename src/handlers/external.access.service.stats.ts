import * as request  from 'request-promise';

import * as kiws     from '@nodeswork/kiws';

import {
  AppletInfo,
  AppletInfoService,
}                    from '../services';

@kiws.Injectable()
export class AppletServiceStats implements kiws.ServiceStats {

  constructor(
    private appletInfo: AppletInfoService,
  ) {}

  stats() {
    const externalAccess: any = {};
    try {
      request.get('http://www.google.com', { timeout: 1000 });
      externalAccess.direct = true;
    } catch (e) {
      externalAccess.direct = false;
    }

    const applet = this.appletInfo.getAppletInfo();

    return { externalAccess, applet };
  }
}

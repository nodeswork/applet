import * as logger from '@nodeswork/logger';
import * as kiws   from '@nodeswork/kiws';

const LOG = logger.getLogger();

@kiws.Service()
export class AppletInfoService {

  private appletInfo: AppletInfo = {
    env:          process.env.NODE_ENV === 'production' ? 'production': 'dev',
    appletToken:  'unset',
  };

  constructor() { }

  registerAppletInfo(info: AppletInfo) {
    this.appletInfo = info;
  }

  getAppletInfo() {
    return this.appletInfo;
  }
}

export interface AppletInfo {
  env:          string;
  appletToken:  string;
}

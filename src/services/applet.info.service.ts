import * as logger   from '@nodeswork/logger';
import * as kiws     from '@nodeswork/kiws';

import { constants } from '../constants';

const LOG = logger.getLogger();

@kiws.Service()
export class AppletInfoService {

  private appletInfo: AppletInfo = {
    env:             process.env.NODE_ENV === 'production' ? 'production': 'dev',
    appletToken:     process.env[constants.environmentKeys.APPLET_TOKEN] || null,
    naType:          process.env[constants.environmentKeys.NA_TYPE] || null,
    naVersion:       process.env[constants.environmentKeys.NA_VERSION] || null,
    packageName:     process.env[constants.environmentKeys.PACKAGE_NAME] || null,
    packageVersion:  process.env[constants.environmentKeys.PACKAGE_VERSION] || null,
  };

  constructor() { }

  getAppletInfo() {
    return this.appletInfo;
  }
}

export interface AppletInfo {
  env:             string;
  appletToken:     string;
  naType:          string;
  naVersion:       string;
  packageName:     string;
  packageVersion:  string;
}

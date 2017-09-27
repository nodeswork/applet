import * as logger   from '@nodeswork/logger';
import * as kiws     from '@nodeswork/kiws';

import { constants } from '../constants';

const LOG = logger.getLogger();

const ENV              = process.env.NODE_ENV === 'production' ? 'production': 'dev';
const APPLET_TOKEN     = process.env[constants.environmentKeys.APPLET_TOKEN] || null;
const NA_TYPE          = process.env[constants.environmentKeys.NA_TYPE] || null;
const NA_VERSION       = process.env[constants.environmentKeys.NA_VERSION] || null;
const PACKAGE_NAME     = process.env[constants.environmentKeys.PACKAGE_NAME] || null;
const PACKAGE_VERSION  = process.env[constants.environmentKeys.PACKAGE_VERSION] || null;
const PRODUCER         = `na-npm-${PACKAGE_NAME}_${PACKAGE_VERSION}`

@kiws.Service()
export class AppletInfoService {

  private appletInfo: AppletInfo = {
    env:             ENV,
    appletToken:     APPLET_TOKEN,
    naType:          NA_TYPE,
    naVersion:       NA_VERSION,
    packageName:     PACKAGE_NAME,
    packageVersion:  PACKAGE_VERSION,
    producer:        PRODUCER,
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
  producer:        string;
}

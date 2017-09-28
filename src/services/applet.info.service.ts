import * as fs       from 'fs-extra';
import * as path     from 'path';
import * as logger   from '@nodeswork/logger';
import * as kiws     from '@nodeswork/kiws';

import { constants } from '../constants';

const LOG = logger.getLogger();

const ENV              = process.env.NODE_ENV === 'production' ? 'production': 'dev';
const APPLET_ID        = process.env[constants.environmentKeys.APPLET_ID] || null;
const APPLET_TOKEN     = process.env[constants.environmentKeys.APPLET_TOKEN] || null;
const NA_TYPE          = process.env[constants.environmentKeys.NA_TYPE] || 'npm';
const NA_VERSION       = process.env[constants.environmentKeys.NA_VERSION] || '8.3.0';
let   PACKAGE_NAME     = process.env[constants.environmentKeys.PACKAGE_NAME] || null;
let   PACKAGE_VERSION  = process.env[constants.environmentKeys.PACKAGE_VERSION] || null;
const PRODUCER         = `na-npm-${PACKAGE_NAME}_${PACKAGE_VERSION}`

if (PACKAGE_NAME == null || PACKAGE_VERSION == null) {
  try {
    const p = require(path.join(process.cwd(), 'package.json'));
    if (PACKAGE_NAME == null) {
      PACKAGE_NAME = p.name;
    }
    if (PACKAGE_VERSION == null) {
      PACKAGE_VERSION = p.version;
    }
  } catch (e) {
    // Ignore
  }
}

@kiws.Service()
export class AppletInfoService {

  private appletInfo: AppletInfo = {
    env:             ENV,
    appletId:        APPLET_ID,
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
  appletId:        string;
  appletToken:     string;
  naType:          string;
  naVersion:       string;
  packageName:     string;
  packageVersion:  string;
  producer:        string;
}

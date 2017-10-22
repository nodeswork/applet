export namespace constants {

  export namespace environmentValues {
    export const NODE_ENV_PRODUCTION   = 'production';
    export const NODE_ENV_DEVELOPMENT  = 'dev';
    export const NODE_ENV_TEST         = 'test';
  }

  export namespace environmentKeys {

    export const NA_TYPE          = 'NW_NA_TYPE';
    export const NA_VERSION       = 'NW_NA_VERSION';
    export const PACKAGE_NAME     = 'NW_PACKAGE_NAME';
    export const PACKAGE_VERSION  = 'NW_PACKAGE_VERSION';

    export const APPLET_ID        = 'NW_APPLET_ID';
    export const APPLET_TOKEN     = 'NW_APPLET_TOKEN';
  }

  export namespace headers.request {

    export const APPLET_ID         = 'Nodeswork-Applet-Id';
    export const APPLET_TOKEN      = 'Nodeswork-Applet-Token';
    export const ACCOUNT_ID        = 'Nodeswork-Account-Id';
    export const ACCOUNT_TOKEN     = 'Nodeswork-Account-Token';
    export const EXECUTION_ID      = 'Nodeswork-Execution-Id';
    export const NA_TYPE           = 'Nodeswork-Na-Type';
    export const NA_VERSION        = 'Nodeswork-Na-Version';
    export const PACKAGE_NAME      = 'Nodeswork-Package-Name';
    export const PACKAGE_VERSION   = 'Nodeswork-Package-Version';
    export const USER_APPLET_ID    = 'Nodeswork-User-Applet-Id';
  }
}

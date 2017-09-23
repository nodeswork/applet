import * as request from 'request-promise';

import * as kiws    from '@nodeswork/kiws';

export class ExternalAccessServiceStats implements kiws.ServiceStats {

  stats() {
    const externalAccess: any = {};
    try {
      request.get('http://www.google.com', { timeout: 1000 });
      externalAccess.direct = true;
    } catch (e) {
      externalAccess.direct = false;
    }

    return { externalAccess };
  }
}

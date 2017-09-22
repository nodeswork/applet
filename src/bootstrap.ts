import { bootstrap as kiwsBootstrap } from '@nodeswork/kiws';

import { AppletModule }               from './modules';

export function bootstrap(...modules: any[]) {
  modules.push(AppletModule);
  kiwsBootstrap.apply(null, modules);
}

import * as _                         from 'underscore';
import { bootstrap as kiwsBootstrap } from '@nodeswork/kiws';

import { AppletModule }               from './modules';

export function bootstrap(modules?: any | any[], options: {
  noStart?: boolean;
} = {}) {
  modules = _.filter(_.flatten([modules]), _.identity);
  modules.push(AppletModule);
  kiwsBootstrap(modules, options);
}

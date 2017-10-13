import * as sbase         from '@nodeswork/sbase';
import * as kiws          from '@nodeswork/kiws';

import { RequestService } from '../services';
import { constants }      from '../constants';
import { ContextLogger }  from './context.logger';

@kiws.Injectable({ inputs: true })
export class ExecutionMetrics {

  @kiws.Inject() context: kiws.ContextInput;
  @kiws.Inject() logger: ContextLogger;

  constructor(
    private request: RequestService,
  ) {}

  async updateMetrics(options: sbase.metrics.MetricsOptions) {

    const executionId = this.context.ctx.get(constants.headers.request.EXECUTION_ID);

    if (executionId == null) {
      this.logger.warn('Execusion id is missing');
      return;
    }

    await this.request.post({
      uri: `/executions/${executionId}/metrics`,
      body: options,
    });
  }
}

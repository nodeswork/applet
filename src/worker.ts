import 'reflect-metadata';

import * as _    from 'underscore';

import * as kiws from '@nodeswork/kiws';

const WORKER_PROVIDER_TAGS = [ 'worker', 'provider' ];
const WORKER_METADATA_KEY  = kiws.ENDPOINT_METADATA_KEY;

export function WorkerProvider(
  options: { tags?: string[], meta?: object } = {},
) {
  const tags = _.union(WORKER_PROVIDER_TAGS, options.tags);
  const handler = kiws.Handler(_.extend({}, options, { tags }));
  return (constructor: kiws.Constructor) => {
    handler(constructor);
  };
}

export interface WorkerOptions {
  name?:     string; // display name for the worker
  schedule?: string;
  hide?:     boolean; // hide from UI
  default?:  boolean; // default worker from UI
}

export function Worker(options: WorkerOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const endpointOptions: kiws.EndpointOptions = {
      method: 'POST',
      path:   `/workers/${target.constructor.name}/${propertyKey}`,
      meta:   options,
    };
    const endpoint = kiws.Endpoint(endpointOptions);
    endpoint(target, propertyKey, descriptor);
  }
}

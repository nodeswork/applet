import * as _                 from 'underscore';

import * as request           from 'request-promise';

import { Account }            from '../../account';
import { RequestService }     from '../../services';
import {
  BaseDigitalCurrencyAccount,
  DigitalCurrencyAccount,
  dc,
}                             from './def';

const defaultRequest = request.defaults({ json: true });

@Account({
  accountType:  'KrakenAccount',
  provider:     'kraken',
})
export class KrakenAccount extends BaseDigitalCurrencyAccount
implements DigitalCurrencyAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }

  public static $acceptCurrencies(): dc.CURRENCY_NAME[] {
    return [
      dc.currencies.BTC,
      dc.currencies.LTC,
      dc.currencies.ETH,
      dc.currencies.USD,
    ];
  }

  public static $acceptTradings(): dc.TRADE_PAIR[] {
    return [
      [dc.currencies.BTC, dc.currencies.USD],
      [dc.currencies.LTC, dc.currencies.BTC],
      [dc.currencies.LTC, dc.currencies.USD],
      [dc.currencies.ETH, dc.currencies.BTC],
      [dc.currencies.ETH, dc.currencies.USD],
      [dc.currencies.ETH, dc.currencies.LTC],
    ];
  }

  public async $getBalance(): Promise<dc.Balance> {
    const balance: {[name: string]: string} = (await this.$operate({
      name:    'getBalance',
      ref:     'Balance',
      method:  'GET',
    })).result;

    const result: dc.Balance = {};
    _.each(balance, (value: string, name: string) => {
      const globalName = toGlobalName(name);
      if (globalName != null) {
        result[globalName]  = Number.parseFloat(value);
      }
    });
    return result;
  }

  public static async $getDepths(pairs: dc.TRADE_PAIR[]): Promise<dc.Depths> {
    const localPairs  = _.map(pairs, (pair) => toLocalPair(pair));
    const depths      = await this.getDepths(localPairs);
    const result: dc.Depths = {};

    _.each(depths, (depth, localPair) => {
      const globalPair        = toGlobalPair(localPair);
      const globalPairString  = dc.pairToString(globalPair);

      const asks = _.map(depth.asks, toGlobalDepthInfo);
      const bids = _.map(depth.bids, toGlobalDepthInfo)

      result[globalPairString] = { asks, bids };
    });
    return result;
  }

  public static async getDepths(
    pairs: string[],
  ): Promise<{ [pair: string]: kraken.Depth }> {
    const result: any = {};

    for (const pair of pairs) {
      const resp = await defaultRequest.get(
        `https://api.kraken.com/0/public/Depth?pair=${pair}`,
      );
      _.extend(result, resp);
    }
    return result;
  }
}

export namespace kraken {

  export interface AccountBalance {
    [name: string]: string;
  }

  export interface Depth {
    asks: Array<[number, number, number]>;
    bids: Array<[number, number, number]>;
  }
}

function toLocalPair(pair: dc.TRADE_PAIR): string {
  const s = toLocalName(pair[0]);
  const t = toLocalName(pair[1]);

  if (s == null || t == null) {
    return null;
  }
  return s + t;
}

function toGlobalPair(pair: string): dc.TRADE_PAIR {
  const x: [string, string] = [pair.substring(0, 4), pair.substring(4, 8)];
  return [toGlobalName(x[0]), toGlobalName(x[1])];
}


function toLocalName(name: dc.CURRENCY_NAME): string {
  switch (name) {
    case dc.currencies.BTC:
      return 'XXBT';
    case dc.currencies.LTC:
      return 'XLTC';
    case dc.currencies.ETH:
      return 'XETH';
    case dc.currencies.USD:
      return 'ZUSD';
    default:
      return null;
  }
}

function toGlobalName(name: string): dc.CURRENCY_NAME {
  switch (name) {
    case 'XXBT':
      return dc.currencies.BTC;
    case 'XLTC':
      return dc.currencies.LTC;
    case 'XETH':
      return dc.currencies.ETH;
    case 'ZUSD':
      return dc.currencies.USD;
    default:
      return null;
  }
}

function toGlobalDepthInfo(
  [price, volume, ts]: [number, number, number],
): dc.DepthInfo {
  return {
    price,
    volume,
    ts,
  };
}


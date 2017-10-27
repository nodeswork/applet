import { BaseAccount }    from '../base-accounts';
import { RequestService } from '../../services';

export class BaseDigitalCurrencyAccount extends BaseAccount {

  constructor(protected $request: RequestService) {
    super($request);
  }

  public static $acceptCurrencies(): dc.CURRENCY_NAME[] {
    return [];
  }

  public static $accept(name: dc.CURRENCY_NAME): boolean {
    return this.$acceptCurrencies().indexOf(name) >= 0;
  }

  public static $acceptTradings(): dc.TRADE_PAIR[] {
    return [];
  }

  public static $acceptTrading(pair: dc.TRADE_PAIR): boolean {
    return this.$acceptTradings().indexOf(pair) >= 0;
  }

  public static async $getDepths(pairs: dc.TRADE_PAIR[]): Promise<dc.Depths> {
    return {};
  }
}

export interface DigitalCurrencyAccount {

  $getBalance(): Promise<dc.Balance>;
}

export namespace dc {

  export function pairToString(pair: TRADE_PAIR): string {
    return pair[0] + '_' + pair[1];
  }

  export function stringToPair(pairStr: string): TRADE_PAIR {
    return pairStr.split('_') as any;
  }

  export namespace currencies {

    export const BTC = 'BTC';

    export const LTC = 'LTC';

    export const ETH = 'ETH';

    export const USD = 'USD';
  }

  export type CURRENCY_NAME   = 'BTC' | 'LTC' | 'ETH' | 'USD';
  export type TRADE_PAIR      = [ CURRENCY_NAME, CURRENCY_NAME ];

  export interface Balance {
    [name: string]: number;
  }

  export interface Depths {
    [name: string]: Depth;
  }

  export interface Depth {
    asks: DepthInfo[];
    bids: DepthInfo[];
  }

  export interface DepthInfo {
    price:   number;
    volume:  number;
    ts?:     number;
  }
}


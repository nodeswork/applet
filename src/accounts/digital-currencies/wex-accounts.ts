import * as _                 from 'underscore';

import * as request           from 'request-promise';

import { Account }            from '../../account';
import { RequestService }     from '../../services';
import {
  BaseDigitalCurrencyAccount,
  DigitalCurrencyAccount,
  dc,
}                             from './def';

@Account({
  accountType:  'WEXAccount',
  provider:     'wex',
})
export class WEXAccount extends BaseDigitalCurrencyAccount
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

  public static async $getDepths(pairs: dc.TRADE_PAIR[]): Promise<dc.Depths> {
    const localPairs = _.map(pairs, (pair) => toLocalPair(pair));
    const depths = await this.getDepth(localPairs);
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

  public async $getBalance(): Promise<dc.Balance> {
    const info                = await this.getInfo();
    const result: dc.Balance  = {};

    _.each(info.funds, (value, name) => {
      const dcName = toGlobalName(name);
      if (dcName != null) {
        result[dcName] = value;
      }
    });

    return result;
  }

  public async getInfo(): Promise<wex.AccountInfo> {
    return (await this.$operate({
      name:    'getInfo',
      ref:     'getInfo',
      method:  'GET',
    })).return;
  }

  public async trade(options: {
    pair:    string;
    type:    string;
    rate:    number;
    amount:  number;
  }): Promise<wex.TradeResult> {
    return (await this.$operate({
      name:    'trade',
      ref:     'Trade',
      method:  'POST',
      body:    _.pick(options, 'pair', 'type', 'rate', 'amount'),
    })).return;
  }

  public async getActiveOrders(
    pair: string,
  ): Promise<wex.ActiveOrders> {
    return (await this.$operate({
      name:    'getActiveOrders',
      ref:     'ActiveOrders',
      method:  'GET',
      body:    { pair },
    })).return;
  }

  public async getOrderInfo(
    orderId: number,
  ): Promise<wex.ActiveOrders> {
    return (await this.$operate({
      name:    'getOrderInfo',
      ref:     'OrderInfo',
      method:  'GET',
      body:    { order_id: orderId },
    })).return;
  }

  public async cancelOrder(
    orderId: number,
  ): Promise<wex.CancelOrderResult> {
    return (await this.$operate({
      name:    'cancelOrder',
      ref:     'CancelOrder',
      method:  'POST',
      body:    { order_id:     orderId },
    })).return;
  }

  public async getTradeHistory(options: {
    from?:   number;
    count?:  number;
    from_id?: number;
    end_id?:  number;
    order?:   string;
    since?:   number;
    end?:     number;
    pair?:    string;
  }): Promise<{ [orderId: string]: wex.TradeHistory }> {
    return (await this.$operate({
      name:    'getTradeHistory',
      ref:     'TradeHistory',
      method:  'GET',
      body:    _.pick(
        options, 'from', 'count', 'from_id', 'end_id', 'order', 'since', 'end',
        'pair',
      ),
    })).return;
  }

  public async getTransactionHistory(options: {
    from?:   number;
    count?:  number;
    from_id?: number;
    end_id?:  number;
    order?:   string;
    since?:   number;
    end?:     number;
  }): Promise<{ [transactionId: string]: wex.TransactionHistory; }> {
    return (await this.$operate({
      name:    'getTransactionHistory',
      ref:     'TransHistory',
      method:  'GET',
      body:    _.pick(
        options, 'from', 'count', 'from_id', 'end_id', 'order', 'since', 'end',
      ),
    })).return;
  }

  public async getCoinDepositAddress(coinName: string): Promise<{
    address: string;
  }> {
    return (await this.$operate({
      name:    'getCoinDepositAddress',
      ref:     'CoinDepositAddress',
      method:  'GET',
      body:    { coinName },
    })).return;
  }

  public async withdrawCoin(options: {
    coinName: string;
    amount:   number;
    address:  string;
  }): Promise<wex.WithdrawResult> {
    return (await this.$operate({
      name:    'withdrawCoin',
      ref:     'WithdrawCoin',
      method:  'POST',
      body:    _.pick(options, 'coinName', 'amount', 'address'),
    })).return;
  }

  public async createCoupon(options: {
    currency: string;
    amount:   number;
    receiver: string;
  }): Promise<wex.CreateCouponResult> {
    return (await this.$operate({
      name:    'createCoupon',
      ref:     'CreateCoupon',
      method:  'POST',
      body:    _.pick(options, 'currency', 'amount', 'receiver'),
    })).return;
  }

  public async redeemCoupon(
    coupon: string,
  ): Promise<wex.RedeemCouponResult> {
    return (await this.$operate({
      name:    'redeemCoupon',
      ref:     'RedeemCoupon',
      method:  'POST',
      body:    { coupon },
    })).return;
  }

  public static async getPublicInfo(): Promise<wex.PublicInfo> {
    return await request.get(
      wex.PUBLIC_API_PREFIX + '/info',
    );
  }

  public static async getPublicTicker(
    pairs: string[],
  ): Promise<{ [pair: string]: wex.Ticker }> {
    return await request.get(
      wex.PUBLIC_API_PREFIX + `/ticker/${pairs.join('-')}`,
    );
  }

  public static async getDepth(
    pairs: string[],
  ): Promise<{ [pair: string]: wex.Depth }> {
    pairs = _.filter(pairs, (x) => !!x);
    return await request.get(
      wex.PUBLIC_API_PREFIX + `/depth/${pairs.join('-')}`,
    );
  }

  public static async getTrades(
    pairs: string[],
  ): Promise<{ [pair: string]: wex.Trade[] }> {
    return await request.get(
      wex.PUBLIC_API_PREFIX + `/trades/${pairs.join('-')}`,
    );
  }
}

function toLocalPair(pair: dc.TRADE_PAIR): string {
  const s = toLocalName(pair[0]);
  const t = toLocalName(pair[1]);

  if (s == null || t == null) {
    return null;
  }
  return s + '_' + t;
}

function toGlobalPair(pair: string): dc.TRADE_PAIR {
  const x: [string, string] = pair.split('_') as any;
  return [toGlobalName(x[0]), toGlobalName(x[0])];
}

function toLocalName(name: dc.CURRENCY_NAME): string {
  switch (name) {
    case dc.currencies.BTC:
      return 'btc';
    case dc.currencies.LTC:
      return 'ltc';
    case dc.currencies.ETH:
      return 'eth';
    case dc.currencies.USD:
      return 'usd';
    default:
      return null;
  }
}

function toGlobalName(name: string): dc.CURRENCY_NAME {
  switch (name) {
    case 'btc':
      return dc.currencies.BTC;
    case 'ltc':
      return dc.currencies.LTC;
    case 'eth':
      return dc.currencies.ETH;
    case 'usd':
      return dc.currencies.USD;
    default:
      return null;
  }
}

function toGlobalDepthInfo([price, volume]: [number, number]): dc.DepthInfo {
  return {
    price,
    volume,
  };
}

export namespace wex {

  export const PUBLIC_API_PREFIX = 'https://wex.nz/api/3';

  export const COINS = {
    BTC: 'BTC',
    LTC: 'LTC',
    NMC: 'NMC',
    NVC: 'NVC',
    PPC: 'PPC',
    DSH: 'DSH',
    ETH: 'ETH',
    BCH: 'BCH',
    ZEC: 'ZEC',
  };

  export const CURRENCIES = {
    USD: 'USD',
    EUR: 'EUR',
    RUR: 'RUR',
  };

  export const PAIRS = {
    BTC_USD: 'btc_usd',
    BTC_RUR: 'btc_rur',
    BTC_EUR: 'btc_eur',
    LTC_BTC: 'ltc_btc',
    LTC_USD: 'ltc_usd',
    LTC_RUR: 'ltc_rur',
    LTC_EUR: 'ltc_eur',
    NMC_BTC: 'nmc_btc',
    NMC_USD: 'nmc_usd',
    NVC_BTC: 'nvc_btc',
    NVC_USD: 'nvc_usd',
    USD_RUR: 'usd_rur',
    EUR_USD: 'eur_usd',
    EUR_RUR: 'eur_rur',
    PPC_BTC: 'ppc_btc',
    PPC_USD: 'ppc_usd',
    DSH_BTC: 'dsh_btc',
    DSH_USD: 'dsh_usd',
    DSH_RUR: 'dsh_rur',
    DSH_EUR: 'dsh_eur',
    DSH_LTC: 'dsh_ltc',
    DSH_ETH: 'dsh_eth',
    ETH_BTC: 'eth_btc',
    ETH_USD: 'eth_usd',
    ETH_EUR: 'eth_eur',
    ETH_LTC: 'eth_ltc',
    ETH_RUR: 'eth_rur',
    BCH_USD: 'bch_usd',
    BCH_BTC: 'bch_btc',
    ZEC_BTC: 'zec_btc',
    ZEC_USD: 'zec_usd',
  };

  export const ORDER_STATUS = {
    ACTIVE:                           0,
    EXECUTED_ORDER:                   1,
    CANCELED:                         2,
    CANCELED_WITH_PARTIAL_EXECUTION:  3,
  };

  export const TRANSACTION_TYPE = {
    DEPOSIT:     1,
    WITHDRAWAL:  2,
    CREDIT:      4,
    DEBIT:       5,
  };

  export const TRANSACTION_STATUS = {
    CANCELED_OR_FAILED:      0,
    WAITING_FOR_ACCEPTANCE:  1,
    SUCCESSFUL:              2,
    NOT_CONFIRMED:           3,
  };

  export const TRADE_TYPES = {
    SELL: 'ask',
    BUY:  'bid',
  };

  export interface AccountInfo {
    funds:        Funds;
    rights:       {
      info:       number;
      trade:      number;
      withdraw:   number;
    };
    open_orders:  number;
    server_time:  number;
  }

  export interface TradeResult {
    received: number;
    remains:  number;
    order_id: number;
    funds:    Funds;
  }

  export interface ActiveOrders {
    [orderId: string]: Order;
  }

  export interface Order {
    pair:               string;
    type:               string;
    amount:             number;
    rate:               number;
    timestamp_created:  number;
    status:             number;
  }

  export interface CancelOrderResult {
    order_id: number;
    funds:    Funds;
  }

  export interface TradeHistory {
    pair:           string;
    type:           string;
    amount:         number;
    rate:           number;
    order_id:       number;
    is_your_order:  number;
    timestamp:      number;
  }

  export interface TransactionHistory {
    type:       number;
    amount:     number;
    currency:   string;
    desc:       string;
    status:     number;
    timestamp:  number;
  }

  export interface WithdrawResult {
    tId:         string;  // transaction id
    amountSent:  number;
    funds:       Funds;
  }

  export interface CreateCouponResult {
    coupon:   string;
    transId:  number;
    funds:    Funds;
  }

  export interface RedeemCouponResult {
    couponAmount:    number;
    couponCurrency:  string;
    transId:         number;
    funds:           Funds;
  }

  export interface PublicInfo {
    server_time:      number;
    pairs:            {
      [pair: string]: PublicPairInfo;
    };
  }

  export interface PublicPairInfo {
    decimal_places:  number;
    min_price:       number;
    max_price:       number;
    min_amount:      number;
    hidden:          number;
    fee:             number;
  }

  export interface Ticker {
    high:     number;
    low:      number;
    avg:      number;
    vol:      number;
    vol_cur:  number;
    last:     number;
    buy:      number;
    sell:     number;
    updated:  number;
  }

  export interface Depth {
    asks: Array<[number, number]>;
    bids: Array<[number, number]>;
  }

  export interface Trade {
    type:       string;
    price:      number;
    amount:     number;
    tid:        number;  // trade id
    timestamp:  number;
  }

  export interface Funds {
    [name: string]:  number;
  }
}

import * as _             from 'underscore';

import * as request       from 'request-promise';

import { BaseAccount }    from './base-accounts';
import { Account }        from '../account';
import { RequestService } from '../services';

@Account({
  accountType:  'WEXAccount',
  provider:     'wex',
})
export class WEXAccount extends BaseAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }

  public async getInfo(): Promise<wex.Response<wex.AccountInfo>> {
    return await this.$operate({
      name:    'getInfo',
      ref:     'getInfo',
      method:  'GET',
    });
  }

  public async trade(options: {
    pair:    string;
    type:    string;
    rate:    number;
    amount:  number;
  }): Promise<wex.Response<wex.TradeResult>> {
    return await this.$operate({
      name:    'trade',
      ref:     'Trade',
      method:  'POST',
      body:    _.pick(options, 'pair', 'type', 'rate', 'amount'),
    });
  }

  public async getActiveOrders(
    pair: string,
  ): Promise<wex.Response<wex.ActiveOrders>> {
    return await this.$operate({
      name:    'getActiveOrders',
      ref:     'ActiveOrders',
      method:  'GET',
      body:    { pair },
    });
  }

  public async getOrderInfo(
    orderId: number,
  ): Promise<wex.Response<wex.ActiveOrders>> {
    return await this.$operate({
      name:    'getOrderInfo',
      ref:     'OrderInfo',
      method:  'GET',
      body:    { order_id: orderId },
    });
  }

  public async cancelOrder(
    orderId: number,
  ): Promise<wex.Response<wex.CancelOrderResult>> {
    return await this.$operate({
      name:    'cancelOrder',
      ref:     'CancelOrder',
      method:  'POST',
      body:    { order_id:     orderId },
    });
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
  }): Promise<wex.Response<{ [orderId: string]: wex.TradeHistory }>> {
    return await this.$operate({
      name:    'getTradeHistory',
      ref:     'TradeHistory',
      method:  'GET',
      body:    _.pick(
        options, 'from', 'count', 'from_id', 'end_id', 'order', 'since', 'end',
        'pair',
      ),
    });
  }

  public async getTransactionHistory(options: {
    from?:   number;
    count?:  number;
    from_id?: number;
    end_id?:  number;
    order?:   string;
    since?:   number;
    end?:     number;
  }): Promise<wex.Response<{
    [transactionId: string]: wex.TransactionHistory;
  }>> {
    return await this.$operate({
      name:    'getTransactionHistory',
      ref:     'TransHistory',
      method:  'GET',
      body:    _.pick(
        options, 'from', 'count', 'from_id', 'end_id', 'order', 'since', 'end',
      ),
    });
  }

  public async getCoinDepositAddress(coinName: string): Promise<wex.Response<{
    address: string;
  }>> {
    return await this.$operate({
      name:    'getCoinDepositAddress',
      ref:     'CoinDepositAddress',
      method:  'GET',
      body:    { coinName },
    });
  }

  public async withdrawCoin(options: {
    coinName: string;
    amount:   number;
    address:  string;
  }): Promise<wex.Response<wex.WithdrawResult>> {
    return await this.$operate({
      name:    'withdrawCoin',
      ref:     'WithdrawCoin',
      method:  'POST',
      body:    _.pick(options, 'coinName', 'amount', 'address'),
    });
  }

  public async createCoupon(options: {
    currency: string;
    amount:   number;
    receiver: string;
  }): Promise<wex.Response<wex.CreateCouponResult>> {
    return await this.$operate({
      name:    'createCoupon',
      ref:     'CreateCoupon',
      method:  'POST',
      body:    _.pick(options, 'currency', 'amount', 'receiver'),
    });
  }

  public async redeemCoupon(
    coupon: string,
  ): Promise<wex.Response<wex.RedeemCouponResult>> {
    return await this.$operate({
      name:    'redeemCoupon',
      ref:     'RedeemCoupon',
      method:  'POST',
      body:    { coupon },
    });
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

  export interface Response<T> {
    success: number;
    return:  T;
  }

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

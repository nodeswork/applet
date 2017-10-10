import * as _             from 'underscore';

import { Account }        from '../account';
import { BaseAccount }    from './base-accounts';
import { RequestService } from '../services';

@Account({
  accountType: 'FifaFut18Account',
  provider:    'fifa-fut-18',
})
export class FifaFut18Account extends BaseAccount {

  constructor(
    protected $request: RequestService,
  ) {
    super($request);
  }

  public async getUserMassInfo(): Promise<fifa.fut18.UserMassInfo> {
    return await this.$operate({
      ref:     'ut/game/fifa18/usermassinfo',
      method:  'GET',
    });
  }

  public async getTradePile(): Promise<fifa.fut18.TradePile> {
    return await this.$operate({
      ref:     'ut/game/fifa18/tradepile',
      method:  'GET',
    });
  }

  public async searchMarket(
    options: fifa.fut18.SearchMarketOptions,
  ): Promise<fifa.fut18.SearchResult> {
    const query = _.mapObject(options, (val) => val.toString());
    return await this.$operate({
      ref:     'ut/game/fifa18/transfermarket',
      method:  'GET',
      query,
    });
  }

  public async bid(
    tradeId: number, price: number,
  ): Promise<fifa.fut18.BidResponse> {
    const url = `ut/game/fifa18/trade/${tradeId}/bid`;
    return await this.$operate({
      ref:     url,
      method:  'PUT',
      body:    {
        bid:   price,
      },
    });
  }

  public async tradeStatus(
    tradeIds: number[],
  ): Promise<fifa.fut18.TradeStatusResponse> {
    return await this.$operate({
      ref:     'ut/game/fifa18/trade/status',
      method:  'GET',
      query:   {
        tradeIds: tradeIds.join(','),
      },
    });
  }

  public async getWatchList(): Promise<fifa.fut18.WatchListResponse> {
    return await this.$operate({
      ref:   'ut/game/fifa18/watchlist',
      method: 'GET',
    });
  }

  public async sendToMyClub(itemIds: number[]): Promise<fifa.fut18.SendItemResponse> {
    const itemData = _.map(itemIds, (itemId) => {
      return {
        id:    itemId,
        pile:  'club',
        // May need tradeId
      };
    });
    return await this.$operate({
      ref:   'ut/game/fifa18/item',
      method: 'PUT',
      body:  {
        itemData,
      },
    });
  }

  public async getClubDevelopmentConsumables()
    : Promise<fifa.fut18.ClubDevelopmentConsumablesResponse> {
    return await this.$operate({
      ref:    'ut/game/fifa18/club/consumables/development',
      method: 'GET',
    });
  }

  public async sendResourceToTransferList(resourceIds: number[])
    : Promise<fifa.fut18.SendItemResponse> {
      const itemData = _.map(resourceIds, (resourceId) => {
        return {
          id:    resourceId,
          pile:  'trade',
        };
      });
      return await this.$operate({
        ref:   'ut/game/fifa18/item/resource',
        method: 'PUT',
        body:  {
          itemData,
        },
      });
  }

  public async list(options: fifa.fut18.ListOptions): Promise<fifa.fut18.ListResponse> {
    const body = {
      buyNowPrice:  options.buyNowPrice,
      duration:     options.duration,
      startingBid:  options.startingBid,
      itemData:     {
        id:         options.itemId,
      },
    };
    return await this.$operate({
      ref:     'ut/game/fifa18/auctionhouse',
      method:  'POST',
      body,
    });
  }

  public async getItems(): Promise<fifa.fut18.ItemResponse> {
    return await this.$operate({
      ref:    'ut/game/fifa18/purchased/items',
      method: 'GET',
    });
  }

  public async deleteSold(): Promise<void> {
    await this.$operate({
      ref:    'ut/game/fifa18/trade/sold',
      method: 'DELETE',
    });
  }
}

export namespace fifa.fut18 {

  export interface ItemResponse {
    duplicateItemIdList?:  DuplicateItemId[];
    itemData:              ItemData[];
  }

  export interface ListResponse {
    id:     number;
    idStr:  string;
  }

  export interface ListOptions {
    buyNowPrice: number;  // 5000
    duration:    number;  // 3600
    itemId:      number;
    startingBid: number;  // 150
  }

  export interface ClubDevelopmentConsumablesResponse {
    itemData: CountableItemData[];
  }

  export interface CountableItemData {
    count:             number;
    discardValue:      number;
    item:              ItemData;
    resourceGameYear:  number;
    resourceId:        number;
    untradeableCount:  number;
  }

  export interface SendItemResponse {
    itemData: ItemMoveResult[];
  }

  export interface ItemMoveResult {
    id:       number;
    pile:     string;
    success:  boolean;
  }

  export interface BaseResponse {
    credits:      number;
  }

  export interface WatchListResponse extends BaseResponse {
    total:        number;
    auctionInfo:  AuctionInfo[];
  }

  export interface BidResponse extends BaseResponse {
    bidTokens:    any;
    currencies:   Currency[];
    auctionInfo:  AuctionInfo[];
  }

  export interface SearchMarketOptions {
    start?: number;  // 0
    num?:   number;  // 16
    type?:  string;  // development
    cat?:   string;  // contract
    lev?:   string;  // gold
    micr?:  number;
    macr?:  number;
    minb?:  number;
    maxb?:  number;  // 300
  }

  export interface TradeStatusResponse {
    auctionInfo:  AuctionInfo[];
    bidTokens:    any;
    credits:      number;
  }

  export interface SearchResult {
    auctionInfo:  AuctionInfo[];
    bidTokens:    any;
  }

  export interface AuctionInfo {
    bidState:           string;
    buyNowPrice:        number;
    confidenceValue:    number;
    currentBid:         number;
    expires:            number;
    offers:             number;
    sellerEstablished:  number;
    sellerId:           number;
    sellerName:         string;
    startingBid:        number;
    tradeId:            number;
    tradeIdStr:         string;
    tradeOwner:         boolean;
    tradeState:         string;
    watched:            boolean;
    itemData:           ItemData;
  }

  export interface ItemData {
    amount?:            number;
    assetId:            number;
    assists:            number;
    attributeList:      any[];
    cardsubtypeid:      number;
    contract:           number;
    discardValue:       number;
    fitness:            number;
    formation:          string;
    id:                 number;
    injuryGames:        number;
    injuryType:         string;
    itemState:          string;
    itemType:           string;
    lastSalePrice:      number;
    leagueId:           number;
    lifetimeAssists:    number;
    lifetimeStats:      any[];
    loyaltyBonus:       number;
    morale:             number;
    nation:             number;
    owners:             number;
    pile:               number;
    playStyle:          number;
    preferredPosition:  string;
    rareflag:           number;
    rating:             number;
    resourceGameYear:   number;
    resourceId:         number;
    statsList:          any[];
    suspension:         number;
    teamid:             number;
    timestamp:          number;
    training:           number;
    untradeable:        boolean;
  }

  export interface TradePile {
    credits:               number;
    bidTokens:             any;
    duplicateItemIdList?:  DuplicateItemId[];
  }

  export interface DuplicateItemId {
    duplicateItemId:  number;
    itemId:           number;
  }

  export interface UserMassInfo {
    userInfo:            UserInfo;
    pileSizeClientData:  PileSizeClientData;
  }

  export interface UserInfo {
    personaId:                    number;
    clubName:                     string;
    clubAbbr:                     string;
    draw:                         number;
    loss:                         number;
    credits:                      number;
    bidTokens:                    object;
    currencies:                   Currency[]
    trophies:                     number;
    won:                          number;
    actives:                      Active[];
    established:                  string;
    divisionOffline:              number;
    divisionOnline:               number;
    personaName:                  string;
    squadList:                    any;
    unopenedPacks:                any;
    purchased:                    boolean;
    reliability:                  any;
    seasonTicket:                 boolean;
    accountCreatedPlatformName:   string;
    fifaPointsFromLastYear:       number;
    fifaPointsTransferredStatus:  number;
    unassignedPileSize:           number;
    feature:                      any;
    sessionCoinsBankBalance:      number;
  }

  export interface Currency {
    name:        string;
    funds:       number;
    finalFunds:  number;
  }

  export interface Active {
    id:                number;
    timestamp:         number;
    formation:         string;
    untradeable:       boolean;
    assetId:           number;
    rating:            number;
    itemType:          string;
    resourceId:        number;
    owners:            number;
    discardValue:      number;
    itemState:         string;
    cardsubtypeid:     number;
    lastSalePrice:     number;
    statsList:         any[];
    lifetimeStats:     any[];
    attributeList:     any[];
    teamid:            number;
    rareflag:          number;
    leagueId:          number;
    pile:              number;
    cardassetid:       number;
    value:             number;
    category:          number;
    manufacturer:      string;
    name:              string;
    resourceGameYear:  number;
  }

  export interface PileSizeClientData {
    entries: KeyValue[];
  }

  export interface KeyValue {
    key:    number;
    value:  number;
  }
}

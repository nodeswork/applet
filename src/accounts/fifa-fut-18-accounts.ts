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

  public async searchMarket(): Promise<fifa.fut18.SearchResult> {
    return await this.$operate({
      ref:     'ut/game/fifa18/transfermarket',
      method:  'GET',
    });
  }

  public async tradeStatus(tradeIds: string[]): Promise<fifa.fut18.TradeStatusResponse> {
    return await this.$operate({
      ref:     'ut/game/fifa18/trade/status',
      method:  'GET',
      query:   {
        tradeIds: tradeIds.join(','),
      },
    });
  }
}

export namespace fifa.fut18 {

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
    credits:    number;
    bidTokens:  any;
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

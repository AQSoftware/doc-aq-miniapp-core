// @flow
import Client from './Client';
import type { HawkCredentials, Environment } from './Client';
import type { MiniAppCredentials } from './Types';

export type LeaderboardScoreTypeEnum = 0 | 1 | 2 | 3 | 4;
export type LeaderboardScoreSortOrderEnum = 0 | 1;


export type LeaderboardDetailResult = {
  id: string,
  createDate: string,
  lastModifiedDate: string,
  playerId: string,
  playerName: string,
  imageBig?: string,
  imageSmall?: string,
  score?: number,
  actual?: number,
  target?: number,
  unit?: string,
  isYou: boolean,
  rank: number
}

export type LeaderboardResult = {
  id: string,
  createDate: string,
  lastModifiedDate: string,
  scoreType: LeaderboardScoreTypeEnum,
  scoreSortOrder: LeaderboardScoreSortOrderEnum,
  details: Array<LeaderboardDetailResult>
}

export type CreateLeaderboardParam = {
  scoreType: LeaderboardScoreTypeEnum,
  scoreSortOrder: LeaderboardScoreSortOrderEnum
}

export type AddLeaderboardParam = {
  playerId: string,
  playerName: string,
  imageBig?: string,
  imageSmall?: string,
  scoreType: LeaderboardScoreTypeEnum,  
  score?: number,
  actual?: number,
  target?: number,
  unit?: string
}

export const LeaderboardScoreType = {
  INT: 0,
  DECIMAL: 1,
  DURATION: 2,
  COMPLETION: 3,
  RECENT: 4
}

export const LeaderboardScoreSortOrder = {
  ASCENDING: 0,
  DESCENDING: 1
}

const BASE_PATH = "";

export class Leaderboard extends Client {

  constructor(credentials: MiniAppCredentials, environment: Environment = 'devt') {
    super(BASE_PATH, { 'id': credentials.id, 'key': credentials.key, 'algorithm': 'sha256' }, environment);
  }

  create(engagementId: string, param: CreateLeaderboardParam): Promise<LeaderboardResult> {
    const url = `engagement/${engagementId}/leaderboard`;
    return this.request("POST", url, param);
  }

  add(engagementId: string, param: AddLeaderboardParam) {
    const url = `engagement/${engagementId}/leaderboard`;
    return this.request("PUT", url, param);
  }

}
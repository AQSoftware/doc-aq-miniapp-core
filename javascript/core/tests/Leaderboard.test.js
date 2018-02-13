// @flow
import { Leaderboard, LeaderboardScoreType, LeaderboardScoreSortOrder } from '../src/core/Leaderboard';
import type { 
  LeaderboardScoreTypeEnum, 
  LeaderboardScoreSortOrderEnum
} from '../src/core/Leaderboard';

const creds = {
  id: 'DinJsI75EeeoXOa-qMgFZg',
  key: 'QXUnLbDizrRXQKrvhvCyipoWdLrziUuX',
  algorithm: 'sha256'
}
const engagementId = 'tUM14I88EeeoXOa-qMgFZg';
const leaderboard = new Leaderboard(creds);

test('create a leaderboard', () => {
  const param = {
    scoreType: LeaderboardScoreType.INT,
    scoreSortOrder: LeaderboardScoreSortOrder.ASCENDING
  };
  return leaderboard.create(engagementId, param);
});


test('add to a leaderboard', () => {
  const param = {
    playerId: '-0w4sBCYEeiGIs7pWbOp4w',
    playerName: 'test',
    imageBig: 'https://loremflickr.com/720/720',
    imageSmall: 'https://loremflickr.com/720/720',
    scoreType: LeaderboardScoreType.INT,
    score: 100,
    unit: 'pts'
  };
  return leaderboard.add(engagementId, param);
});
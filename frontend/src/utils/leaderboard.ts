import type { UserLeaderboard, UserLeaderboardDisplay } from "../types"

export const convertLeaderboard = (data: {value: string, score: number}[]): UserLeaderboardDisplay[]  => {
  const rA: UserLeaderboardDisplay[] = []
  for(let i = 0; i < data.length; i++) {
    const temp: UserLeaderboard = JSON.parse(data[i].value);
    rA.push({
      username: temp.username,
      profilePicture: temp.profilePicture || null,
      score: data[i].score
    })
  }
  return rA.reverse()
}
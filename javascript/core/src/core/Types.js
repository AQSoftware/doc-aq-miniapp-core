//@flow

export type Friend = {
  id: string,
  displayName: string,
  avatarBig: ?string,
  avatarSmall: ?string
}

export type AppData = {
  source: Friend,
  shouldWin: boolean,
  winImage: ?string
}

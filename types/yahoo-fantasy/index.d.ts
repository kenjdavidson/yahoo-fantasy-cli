declare module 'yahoo-fantasy' {
  /// User Info
  export type UserInfo = {
    sub: string;
    name: string;
    given_name: string;
    locale: string;
    email: string;
    email_verified: true;
    birthdate: string;
    nickname: string;
    gender: string;
    picture: string;
  };

  export class UserResource {
    games: () => Game[];
  }
  /// End User Info

  /// Games Collection
  export type Game = {};
  export class GamesCollection {}
  /// End Games Collection

  /// Leagues Collection
  export type League = {};
  export class LeaguesCollection {}
  /// End Leagues Collection

  export type AccessTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: Number;
    token_type: string;
    state?: string;
  };

  export type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: Number;
    token_type: string;
  };

  export type Query = {
    code: string;
    state?: string;
  };

  export type Request = {
    query: Query;
  };

  export type Response = {
    redirect: (string) => void;
    send: (string) => void;
  };

  declare class YahooFantasy {
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    REDIRECT_URI: string;
    constructor(
      clientId: string,
      clientSecret: string,
      tokenCallbackFn?: (err: Error, token: AccessTokenResponse) => void,
      redirectUri?: string,
    );
    refreshTokenCallback: (token: RefreshTokenResponse) => void;
    auth: (res: Response) => void;
    authCallback: (
      req: Request,
      cb: (err: Error, token: AccessTokenResponse) => void,
    ) => void;
    setUserToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    refreshToken: (
      cb: (err: Error, token: RefreshTokenResponse) => void,
    ) => void;
    api: <T>(...args: any[]) => Promise<T>;

    games: GamesCollection;
    user: UserResource;
  }

  export default YahooFantasy;
}

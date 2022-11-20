import YahooFantasy from 'yahoo-fantasy';
import OAuth2Config from '../oauth2/OAuth2Config.js';
import OAuth2Token from '../oauth2/OAuth2Token.js';

class YahooFantasyWrapper extends YahooFantasy {
  token?: OAuth2Token;

  constructor(key: string, secret: string, redirectUri: string = 'oob') {
    super(key, secret, () => {}, redirectUri);
  }

  withToken(token: OAuth2Token): YahooFantasyWrapper {
    this.token = token;
    this.setUserToken(token.accessToken);
    this.setRefreshToken(token.refreshToken);
    return this;
  }

  static async load(): Promise<YahooFantasyWrapper> {
    const config = await OAuth2Config.load();
    const token = await OAuth2Token.load();

    return new YahooFantasyWrapper(
      config.clientId,
      config.clientSecret,
      config.redirectUri,
    ).withToken(token);
  }
}

export default YahooFantasyWrapper;

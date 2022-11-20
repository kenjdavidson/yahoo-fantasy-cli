import { RefreshTokenResponse } from 'yahoo-fantasy';
import { read, write } from '../utils.js';

// This should probably be switched so that UserDetails contains Token
export interface UserDetails {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export default class OAuth2Token {
  accessToken: string;
  refreshToken: string;
  state?: string;
  userDetails?: UserDetails;

  constructor(accessToken: string, refreshToken: string, state?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.state = state;
  }

  setUserDetails(userDetails: UserDetails) {
    this.userDetails = userDetails;
  }

  refresh(token: OAuth2Token) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
  }

  static fromJson(content: any) {
    // Shady but if one has a _ assume it's snake
    const snake = Object.keys(content).find((key) => key.includes('_'));
    const token = snake
      ? new OAuth2Token(
          content.access_token,
          content.refresh_token,
          content.state,
        )
      : new OAuth2Token(
          content.accessToken,
          content.refreshToken,
          content.state,
        );
    token.userDetails = content.userDetails;
    return token;
  }

  static async load(): Promise<OAuth2Token> {
    return await read<OAuth2Token>('token', OAuth2Token.fromJson);
  }

  async save() {
    await write('token', this);
  }
}

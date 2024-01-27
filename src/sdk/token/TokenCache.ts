import { TokenCache, TokenStore } from "@commercetools/sdk-client-v2";

export class MyTokenCache implements TokenCache {
  public myCache: TokenStore = {
    token: "",
    expirationTime: 1,
    refreshToken: "",
  };

  public set(newCache: TokenStore) {
    this.myCache = newCache;
  }

  public get() {
    return this.myCache;
  }
}

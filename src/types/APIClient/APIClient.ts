import { MyTokenCache } from "../../sdk/token/TokenCache";

export interface IpasswordAuthMiddlewareOptions {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes: string[];
  tokenCache: MyTokenCache;
  fetch: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ) => Promise<Response>;
}

export interface IAnonimeOptions {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  scopes: string[];
  tokenCache: MyTokenCache;
  fetch: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ) => Promise<Response>;
}

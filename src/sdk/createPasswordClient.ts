import {
  ClientBuilder,
  createAuthForPasswordFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import { projectKey, httpMiddlewareOptions } from "./commercetoolsApiRoot";
import { MyTokenCache } from "./token/TokenCache";

import {
  IAnonimeOptions,
  IpasswordAuthMiddlewareOptions,
} from "../types/APIClient/APIClient";

export function createPasswordClient(
  email: string,
  password: string,
  tokenCache: MyTokenCache,
) {
  return {
    host: "https://auth.europe-west1.gcp.commercetools.com",
    projectKey: "crisp",
    credentials: {
      clientId: "csUXbu0ZdN2RgS7CUSXPQcO9",
      clientSecret: "1WmTyp03WZpbGcPYLUEzg9ZVjKYSoMtR",
      user: {
        username: email,
        password,
      },
    },
    scopes: [`manage_project:${projectKey}`],
    tokenCache,
    fetch,
  };
}

export function createClient(
  passwordAuthMiddlewareOptions: IpasswordAuthMiddlewareOptions,
) {
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withMiddleware(createAuthForPasswordFlow(passwordAuthMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build();
  return client;
}

export function createAnonimusFlow(tokenCache: MyTokenCache) {
  return {
    host: "https://auth.europe-west1.gcp.commercetools.com",
    projectKey: "crisp",
    credentials: {
      clientId: "csUXbu0ZdN2RgS7CUSXPQcO9",
      clientSecret: "1WmTyp03WZpbGcPYLUEzg9ZVjKYSoMtR",
    },
    scopes: [`manage_project:${projectKey}`],
    tokenCache,
    fetch,
  };
}
export function createAnonimusClient(anonimeOptions: IAnonimeOptions) {
  const anonimusClient = new ClientBuilder()
    .withAnonymousSessionFlow(anonimeOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
  return anonimusClient;
}

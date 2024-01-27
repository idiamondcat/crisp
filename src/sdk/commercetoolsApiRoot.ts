import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";

export const projectKey = "crisp";
export const authMiddlewareOptions = {
  host: "https://auth.europe-west1.gcp.commercetools.com",
  projectKey: "crisp",
  credentials: {
    clientId: "csUXbu0ZdN2RgS7CUSXPQcO9",
    clientSecret: "1WmTyp03WZpbGcPYLUEzg9ZVjKYSoMtR",
  },
  scopes: [`manage_project:${projectKey}`],
  fetch,
};

export const httpMiddlewareOptions = {
  host: "https://api.europe-west1.gcp.commercetools.com",
  fetch,
};

const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
  .withMiddleware(createHttpClient(httpMiddlewareOptions))
  .withUserAgentMiddleware()
  .build();

const anonimusClient = new ClientBuilder()
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();
export const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
export const anonimusApiRoot: ApiRoot =
  createApiBuilderFromCtpClient(anonimusClient);

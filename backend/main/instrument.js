import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://6f43f40b70527b69c77e70088e62d62e@o4508206956478464.ingest.de.sentry.io/4509587125698640",
  tracesSampleRate: 1.0,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
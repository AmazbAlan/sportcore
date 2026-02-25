export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  url: env('PUBLIC_URL'),   // <— важно
  proxy: true,              // <— важно если nginx / render / railway / etc

  app: {
    keys: env.array('APP_KEYS'),
  },
});
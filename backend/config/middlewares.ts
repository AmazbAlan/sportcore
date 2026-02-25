module.exports = [
  'strapi::errors',

  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],

          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://res.cloudinary.com',
            'https://*.cloudinary.com',
            'https://sportcore.kg',
            'https://www.sportcore.kg',
            'https://sportcore-production.up.railway.app',
          ],

          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://res.cloudinary.com',
            'https://*.cloudinary.com',
            'https://sportcore.kg',
            'https://www.sportcore.kg',
            'https://sportcore-production.up.railway.app',
          ],

          'connect-src': [
            "'self'",
            'https:',
            'wss:',
          ],

          'frame-src': ["'self'"],
        },
      },
    },
  },

  {
  name: 'strapi::cors',
  config: {
    origin: [
      'https://sportcore.kg',
      'https://www.sportcore.kg',
      'https://sportcore-production.up.railway.app',
    ],
    credentials: true,
  },
},

  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
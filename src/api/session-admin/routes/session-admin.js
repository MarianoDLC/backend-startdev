'use strict';

/**
 * session-admin router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::session-admin.session-admin');

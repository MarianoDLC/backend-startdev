'use strict';

/**
 * session-admin service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::session-admin.session-admin');

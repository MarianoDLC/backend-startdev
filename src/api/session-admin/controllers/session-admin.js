'use strict';

/**
 * session-admin controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::session-admin.session-admin');

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/practicants/verify-password',
      handler: 'practicant.verifyPassword',
      config: {
        auth: false, // ← Sin autenticación (solo para pruebas)
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/practicants/update-profile',
      handler: 'practicant.updateProfile',
      config: {
        auth: false, // ← Sin autenticación (solo para pruebas)
        policies: [],
        middlewares: [],
      },
    },
  ],
};
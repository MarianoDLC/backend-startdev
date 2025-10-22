module.exports = {
  routes: [
    {
      method: "POST", // <--- OJO, que sea POST
      path: "/administrator/auth/login",
      handler: "auth.login",
      config: { auth: false },
    },
  ],
};
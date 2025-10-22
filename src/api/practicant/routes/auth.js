module.exports = {
  routes: [
    {
      method: "POST", // <--- OJO, que sea POST
      path: "/practicant/auth/login",
      handler: "auth.login",
      config: { auth: false },
    },
  ],
};
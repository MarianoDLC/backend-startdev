const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(ctx) {
    try {
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        return ctx.badRequest(null, "Email y contraseña son requeridos");
      }

      const user = await strapi.db.query("api::administrator.administrator").findOne({
        where: { email_administrator: email },
      });

      if (!user) {
        return ctx.badRequest(null, "Usuario no encontrado");
      }

      const validPassword = await bcrypt.compare(password, user.pass_administrator);
      if (!validPassword) {
        return ctx.badRequest(null, "Contraseña incorrecta");
      }

      const token = jwt.sign(
        { id: user.id, role: "administrator" },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      // ✅ Formato estándar esperado por Strapi 5
      ctx.status = 200;
      ctx.body = {
        data: {
          jwt: token,
          user,
          role: "administrator",
        },
        error: null,
      };
    } catch (err) {
      console.error("Error en login administrator:", err);
      ctx.status = 500;
      ctx.body = {
        data: null,
        error: { message: "Ocurrió un error en el servidor" },
      };
    }
  },
};

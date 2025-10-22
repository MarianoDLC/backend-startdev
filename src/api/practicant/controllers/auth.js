const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async login(ctx) {
    try {
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        return ctx.badRequest("Email y contraseña son requeridos");
      }

      // Buscar primero en Administrador
      let user = await strapi.db
        .query("api::administrator.administrator")
        .findOne({
          where: { email_administrator: email },
        });

      let role = "Administrador";

      // Si no existe como administrador, buscar en practicant
      if (!user) {
        user = await strapi.db
          .query("api::practicant.practicant")
          .findOne({
            where: { email_practicant: email },
          });
        role = "Practicante";
      }

      // Si no se encontró en ninguna tabla
      if (!user) {
        return ctx.unauthorized("Usuario no encontrado");
      }

      // Determinar qué campo de contraseña usar según el rol
      const userPassword =
        role === "Administrador"
          ? user.pass_administrator
          : user.password_pract;

      // Verificar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("password ingresado: " + password);
      console.log("hash ingresado: " + hashedPassword);
      console.log("hash bd"+userPassword);
      const validPassword = await bcrypt.compare(password, userPassword);
      if (!validPassword) {
        return ctx.unauthorized("Contraseña incorrecta");
      }

      // Crear token JWT
      const token = jwt.sign(
        { id: user.id, role },
        process.env.JWT_SECRET || "clave_secreta_predeterminada",
        { expiresIn: "1h" }
      );

      return ctx.send({
        data: {
          jwt: token,
          user,
          role,
        },
        error: null,
      });
    } catch (err) {
      console.error("Error en login:", err);
      return ctx.internalServerError("Ocurrió un error en el servidor");
    }
  },
};

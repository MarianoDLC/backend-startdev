"use strict";

const { createCoreController } = require("@strapi/strapi").factories;
const bcrypt = require("bcryptjs");

module.exports = createCoreController("api::practicant.practicant", ({ strapi }) => ({
  // 🔧 TEMPORAL: Resetear contraseña sin verificar la actual
  async resetPassword(ctx) {
    try {
      const { documentId, newPassword } = ctx.request.body;
      console.log("🔧 [TEMPORAL] Reseteando contraseña sin verificación...");

      if (!documentId || !newPassword) {
        return ctx.badRequest("DocumentId y nueva contraseña son requeridos");
      }

      // Buscar practicante
      const practicant = await strapi.documents("api::practicant.practicant").findOne({ documentId });

      if (!practicant) {
        return ctx.notFound("Practicante no encontrado");
      }

      // Hashear la nueva contraseña
      console.log("🧩 Nueva contraseña recibida:", newPassword);
      console.log("🧩 Tipo:", typeof newPassword);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("🔐 Hash generado:", hashedPassword);

      // Actualizar
      await strapi.documents("api::practicant.practicant").update({
        documentId: practicant.documentId,
        data: { password_pract: hashedPassword },
      });

      // 🔎 Verificar lo que se guardó en la BD inmediatamente después del update
      const afterUpdate = await strapi.documents("api::practicant.practicant").findOne({ documentId });
      console.log("📦 Hash guardado en BD (post-update):", afterUpdate?.password_pract);
      console.log("🔍 ¿Coinciden hash generado y guardado?:", afterUpdate?.password_pract === hashedPassword);

      // Publicar
      await strapi.documents("api::practicant.practicant").publish({
        documentId: practicant.documentId,
      });

      // 🔎 Verificar de nuevo después de publish (por si hay hooks que alteren en publish)
      const afterPublish = await strapi.documents("api::practicant.practicant").findOne({ documentId });
      console.log("📦 Hash guardado en BD (post-publish):", afterPublish?.password_pract);
      console.log("🔍 ¿Coinciden post-update y post-publish?:", afterUpdate?.password_pract === afterPublish?.password_pract);

      console.log("✅ Contraseña reseteada correctamente");
      return ctx.send({
        success: true,
        message: "Contraseña actualizada. Ahora usa esta para cambios futuros.",
      });
    } catch (error) {
      console.error("❌ Error al resetear contraseña:", error);
      return ctx.internalServerError("Error: " + error.message);
    }
  },

  // 🔍 Verificar contraseña (para login o validación)
  async verifyPassword(ctx) {
    try {
      const { email, password } = ctx.request.body;

      if (!email || !password) {
        return ctx.badRequest("Email y contraseña son requeridos");
      }

      // Buscar practicante por email
      const practicants = await strapi.entityService.findMany("api::practicant.practicant", {
        filters: { email_practicant: email },
      });

      if (!practicants?.length) {
        return ctx.notFound("Practicante no encontrado");
      }

      const practicant = practicants[0];

      // Comparar contraseña usando bcrypt
      console.log("🔍 Verificando password para:", email);
      console.log("🔐 Hash en BD para verificación:", practicant.password_pract);
      const isPasswordValid = await bcrypt.compare(password, practicant.password_pract);

      console.log(`🔑 Login practicant: ${email} → ${isPasswordValid ? "✅ válida" : "❌ inválida"}`);

      return ctx.send({ valid: isPasswordValid });
    } catch (error) {
      console.error("❌ Error al verificar contraseña:", error);
      return ctx.internalServerError("Error al verificar contraseña");
    }
  },

  // 🔐 Actualizar perfil con verificación de contraseña
  async updateProfile(ctx) {
    try {
      const { documentId, name, currentPassword, newPassword } = ctx.request.body;

      console.log("📥 Datos recibidos:", { documentId, name, currentPassword, newPassword });

      if (!documentId || !name) {
        return ctx.badRequest("DocumentId y nombre son requeridos");
      }

      // Buscar practicante por documentId
      const practicant = await strapi.documents("api::practicant.practicant").findOne({ documentId });

      if (!practicant) {
        console.log("❌ No se encontró practicante:", documentId);
        return ctx.notFound("Practicante no encontrado");
      }

      console.log("✅ Practicante encontrado:", {
        id: practicant.id,
        documentId: practicant.documentId,
        name: practicant.name_pract,
        hash: practicant.password_pract,
      });

      // Si hay cambio de contraseña
      if (currentPassword && newPassword) {
        console.log("🔐 Verificando contraseña actual...");

        // Log adicional antes de comparar
        console.log("🔑 Contraseña actual (texto):", currentPassword);
        console.log("🔐 Hash en BD antes de comparar:", practicant.password_pract);

        const isPasswordValid = await bcrypt.compare(currentPassword, practicant.password_pract);
        console.log("   ¿Contraseña válida?:", isPasswordValid);

        if (!isPasswordValid) {
          console.log("❌ Contraseña actual incorrecta");
          return ctx.badRequest("La contraseña actual es incorrecta");
        }

        // console.log("✅ Contraseña verificada, encriptando nueva...");

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // console.log("🔐 Nuevo hash generado:", hashedPassword);

        await strapi.documents("api::practicant.practicant").update({
          documentId: practicant.documentId,
          data: {
            name_pract: name,
            password_pract: newPassword,
          },
        });

        // Verificar inmediatamente lo que quedó guardado tras update
        const afterUpdate = await strapi.documents("api::practicant.practicant").findOne({ documentId });
        console.log("📦 Nuevo hash guardado (post-update):", afterUpdate?.password_pract);
        console.log("🔍 ¿Coinciden nuevo hash generado y guardado?:", afterUpdate?.password_pract === newPassword);

        await strapi.documents("api::practicant.practicant").publish({
          documentId: practicant.documentId,
        });

        // Verificar después de publish por si hay hooks que cambien el valor
        const afterPublish = await strapi.documents("api::practicant.practicant").findOne({ documentId });
        console.log("📦 Nuevo hash guardado (post-publish):", afterPublish?.password_pract);
        console.log("🔍 ¿Coinciden post-update y post-publish?:", afterUpdate?.password_pract === afterPublish?.password_pract);

        console.log("✅ Perfil actualizado con nueva contraseña");
        return ctx.send({ message: "Perfil y contraseña actualizados correctamente" });
      }

      // Solo actualiza el nombre
      console.log("📝 Actualizando solo nombre...");
      await strapi.documents("api::practicant.practicant").update({
        documentId: practicant.documentId,
        data: { name_pract: name },
      });

      
      await strapi.documents("api::practicant.practicant").publish({
        documentId: practicant.documentId,
      });

      console.log("✅ Nombre actualizado y publicado");
      return ctx.send({ message: "Perfil actualizado correctamente" });
    } catch (error) {
      console.error("❌ Error en updateProfile:", error);
      return ctx.internalServerError("Error al actualizar perfil: " + error.message);
    }
  },
}));

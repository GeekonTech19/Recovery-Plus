import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../config/prisma";
import { env } from "../config/env";

function createResetToken() {
  const rawToken =
    crypto.randomBytes(32).toString("hex");

  const tokenHash =
    crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

  return {
    rawToken,
    tokenHash,
  };
}

function buildResetUrl(rawToken: string) {
  return (
    `${env.FRONTEND_URL}/reset-password?token=` +
    encodeURIComponent(rawToken)
  );
}

/**
 * Starts the password-reset flow.
 *
 * Deliberately returns the same public response whether
 * or not the email exists, preventing account discovery.
 */
export async function requestPasswordReset(
  email: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    return {
      message:
        "If an account exists for this email, a password reset link will be sent.",
    };
  }

  /*
   * Invalidate previous unused reset tokens.
   */
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  const {
    rawToken,
    tokenHash,
  } = createResetToken();

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(
        Date.now() + 30 * 60 * 1000
      ),
    },
  });

  const resetUrl =
    buildResetUrl(rawToken);

  /*
   * Local development:
   * print the URL so the complete flow can be tested
   * without an email provider.
   *
   * Production:
   * the token is not returned through the API.
   * A real email provider will send the link later.
   */
  if (env.NODE_ENV !== "production") {
    console.log("");
    console.log(
      "============================================="
    );
    console.log(
      "RECOVERY+ PASSWORD RESET"
    );
    console.log(
      "============================================="
    );
    console.log(
      `User: ${user.email}`
    );
    console.log(
      `Reset URL: ${resetUrl}`
    );
    console.log(
      "Token expires in 30 minutes."
    );
    console.log(
      "============================================="
    );
    console.log("");
  }

  return {
    message:
      "If an account exists for this email, a password reset link will be sent.",
    ...(env.NODE_ENV !== "production"
      ? { resetUrl }
      : {}),
  };
}

/**
 * Validates a reset token and changes the password.
 */
export async function resetPassword(
  rawToken: string,
  newPassword: string
) {
  if (!rawToken) {
    throw new Error(
      "Password reset token is required"
    );
  }

  const tokenHash =
    crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

  const resetToken =
    await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

  if (!resetToken) {
    throw new Error(
      "Invalid password reset token"
    );
  }

  if (resetToken.usedAt) {
    throw new Error(
      "This password reset link has already been used"
    );
  }

  if (
    resetToken.expiresAt < new Date()
  ) {
    throw new Error(
      "Password reset token has expired"
    );
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 12);

  await prisma.$transaction(
    async (tx) => {
      await tx.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      await tx.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          usedAt: new Date(),
        },
      });

      /*
       * Invalidate any other unused reset tokens
       * belonging to this account.
       */
      await tx.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: {
            not: resetToken.id,
          },
        },
        data: {
          usedAt: new Date(),
        },
      });
    }
  );

  return {
    message:
      "Your password has been reset successfully.",
  };
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import prisma from "../config/prisma";
import { env } from "../config/env";

type RegisterUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginUserInput = {
  email: string;
  password: string;
};

/**
 * Creates a secure verification token.
 *
 * The raw token is returned only to the caller.
 * Only its SHA-256 hash is stored in the database.
 */
function createVerificationToken() {
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

function buildVerificationUrl(
  rawToken: string
) {
  return (
    `${env.FRONTEND_URL}/verify-email?token=` +
    encodeURIComponent(rawToken)
  );
}

export async function registerUser(
  data: RegisterUserInput
) {
  const existing =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existing) {
    throw new Error(
      "A user with this email already exists"
    );
  }

  const password =
    await bcrypt.hash(data.password, 12);

  const result =
    await prisma.$transaction(
      async (tx) => {
        const n =
          await tx.communityUserNumber.create({
            data: {},
          });

        const user =
          await tx.user.create({
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password,
              communityUsername:
                `R+user${n.id}`,
              emailVerified: false,
              status: "ACTIVE",
            },
          });

        const {
          rawToken,
          tokenHash,
        } = createVerificationToken();

        await tx.emailVerificationToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(
              Date.now() +
                30 * 60 * 1000
            ),
          },
        });

        return {
          user,
          rawToken,
        };
      }
    );

  const verificationUrl =
    buildVerificationUrl(
      result.rawToken
    );

  /*
   * During development we log the verification
   * URL so the complete flow can be tested
   * without an email provider.
   *
   * Production does not expose the token.
   */
  if (env.NODE_ENV !== "production") {
    console.log("");
    console.log(
      "============================================="
    );
    console.log(
      "RECOVERY+ EMAIL VERIFICATION"
    );
    console.log(
      "============================================="
    );
    console.log(
      `User: ${result.user.email}`
    );
    console.log(
      `Verification URL: ${verificationUrl}`
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
    id: result.user.id,
    firstName: result.user.firstName,
    lastName: result.user.lastName,
    email: result.user.email,
    createdAt: result.user.createdAt,
    role: result.user.role,
    emailVerified:
      result.user.emailVerified,
    status: result.user.status,

    /*
     * Keep this available locally so we can
     * continue testing verification.
     *
     * Never expose the verification token
     * through the production API.
     */
    ...(env.NODE_ENV !== "production"
      ? { verificationUrl }
      : {}),
  };
}

export async function verifyEmailToken(
  rawToken: string
) {
  if (!rawToken) {
    throw new Error(
      "Verification token is required"
    );
  }

  const tokenHash =
    crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

  const verificationToken =
    await prisma.emailVerificationToken.findUnique({
      where: {
        tokenHash,
      },
    });

  if (!verificationToken) {
    throw new Error(
      "Invalid verification token"
    );
  }

  if (verificationToken.usedAt) {
    throw new Error(
      "This verification link has already been used"
    );
  }

  if (
    verificationToken.expiresAt <
    new Date()
  ) {
    throw new Error(
      "Verification token has expired"
    );
  }

  const user =
    await prisma.$transaction(
      async (tx) => {
        await tx.emailVerificationToken.update({
          where: {
            id: verificationToken.id,
          },
          data: {
            usedAt: new Date(),
          },
        });

        return tx.user.update({
          where: {
            id: verificationToken.userId,
          },
          data: {
            emailVerified: true,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            emailVerified: true,
            status: true,
          },
        });
      }
    );

  return user;
}

export async function resendVerificationEmail(
  email: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  /*
   * Don't reveal whether an email exists.
   */
  if (!user) {
    return {
      message:
        "If an account exists for this email, a verification link will be sent.",
    };
  }

  if (user.emailVerified) {
    return {
      message:
        "This email address is already verified.",
    };
  }

  /*
   * Invalidate previous unused verification
   * tokens.
   */
  await prisma.emailVerificationToken.updateMany({
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
  } = createVerificationToken();

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(
        Date.now() +
          30 * 60 * 1000
      ),
    },
  });

  const verificationUrl =
    buildVerificationUrl(rawToken);

  if (env.NODE_ENV !== "production") {
    console.log("");
    console.log(
      "============================================="
    );
    console.log(
      "RECOVERY+ RESENT EMAIL VERIFICATION"
    );
    console.log(
      "============================================="
    );
    console.log(
      `User: ${user.email}`
    );
    console.log(
      `Verification URL: ${verificationUrl}`
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
      "If an account exists for this email, a verification link will be sent.",
    ...(env.NODE_ENV !== "production"
      ? { verificationUrl }
      : {}),
  };
}

export async function loginUser(
  data: LoginUserInput
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (
    !user ||
    !(await bcrypt.compare(
      data.password,
      user.password
    ))
  ) {
    throw new Error(
      "Invalid email or password"
    );
  }

  /*
   * Suspended accounts cannot log in.
   */
  if (user.status === "SUSPENDED") {
    throw new Error(
      "This account has been suspended"
    );
  }

  /*
   * We are deliberately NOT blocking
   * unverified existing users yet.
   *
   * We will enable that after existing
   * Recovery+ accounts have been handled safely.
   */

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,

    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified:
        user.emailVerified,
      createdAt: user.createdAt,
    },
  };
}

import prisma from "../config/prisma";

export async function bootstrapSuperAdmin() {
  const email = process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  if (!email) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error(
      `BOOTSTRAP_SUPER_ADMIN_EMAIL was not found: ${email}`
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  console.log(
    `✅ Existing user promoted to SUPER_ADMIN: ${user.email}`
  );
}

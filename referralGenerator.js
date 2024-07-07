const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function generateAndStoreReferralCode() {
  let referralCode;
  try {
    do {
      referralCode = crypto
        .randomBytes(16)
        .toString("hex")
        .toUpperCase()
        .slice(0, 6);
    } while (await prisma.referral.findUnique({ where: { referralCode } }));

    const referrerEmail = "default@example.com";

    const existingReferral = await prisma.referral.findUnique({
      where: { referrerEmail },
    });

    if (existingReferral) {
      return existingReferral; // Return existing referral if found
    }

    const newReferral = await prisma.referral.create({
      data: {
        referralCode,
        referrerEmail,
      },
    });

    return newReferral;
  } catch (error) {
    console.error("Error generating or storing referral code:", error);
    throw error;
  }
}

module.exports = { generateAndStoreReferralCode };

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

const { generateAndStoreReferralCode } = require("./referralGenerator");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.post("/referrals/generate-code", async (req, res) => {
  try {
    const newReferral = await generateAndStoreReferralCode();
    res.json({ referralCode: newReferral.referralCode });
  } catch (error) {
    console.error("Error generating referral code:", error);
    res.status(500).json({ message: "Error generating referral code" });
  }
});

app.get("/referrals/:referralCode", async (req, res) => {
  const { referralCode } = req.params;
  try {
    const referral = await prisma.referral.findUnique({
      where: { referralCode },
      select: {
        id: true,
        referrerEmail: true,
        refereeEmail: true,
        referralCode: true,
        createdAt: true,
        referrerName: true,
        refereeName: true,
      },
    });
    if (!referral) {
      return res.status(404).json({ message: "Referral code not found" });
    }
    res.json(referral);
  } catch (error) {
    console.error("Error retrieving referral information:", error);
    res.status(500).json({ message: "Error retrieving referral information" });
  }
});

app.get("/referrals/user", async (req, res) => {
  const { userId } = req.query;
  try {
    const referrals = await prisma.referral.findMany({
      where: { referrerEmail: userId },
      select: {
        id: true,
        referrerEmail: true,
        refereeEmail: true,
        referralCode: true,
        createdAt: true,
        referrerName: true,
        refereeName: true,
      },
    });
    res.json(referrals);
  } catch (error) {
    console.error("Error retrieving referral history:", error);
    res.status(500).json({ message: "Error retrieving referral history" });
  }
});

app.post("/referrals", async (req, res) => {
  const { refereeEmail, refereeName } = req.body;
  try {
    const existingReferral = await prisma.referral.findUnique({
      where: { refereeEmail },
    });
    if (existingReferral) {
      return res
        .status(400)
        .json({ message: "Referral already exists for this email" });
    }
    const newReferral = await prisma.referral.create({
      data: {
        refereeEmail,
        refereeName,
      },
    });
    res.json(newReferral);
  } catch (error) {
    console.error("Error creating referral record:", error);
    res.status(500).json({ message: "Error creating referral record" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

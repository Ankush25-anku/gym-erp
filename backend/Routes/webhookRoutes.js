// routes/webhookRoutes.js
const express = require("express");
const router = express.Router();
require("dotenv").config();
const User = require("../models/User");
const { Webhook } = require("svix");

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

/**
 * 1) TEMP / TEST endpoint (NO signature verification)
 */
router.post("/test", express.raw({ type: "application/json" }), async (req, res) => {
  let raw;
  if (Buffer.isBuffer(req.body)) {
    raw = req.body.toString();
  } else if (typeof req.body === "object") {
    raw = JSON.stringify(req.body);
  } else {
    raw = req.body || "";
  }

  console.log("🔍 [TEST] Webhook raw payload:", raw);

  try {
    const evt = JSON.parse(raw || "{}");
    // OPTIONAL: mimic production behaviour to test upsert logic
    await handleClerkEvent(evt);
    return res.status(200).json({ received: true, test: true, parsed: evt });
  } catch (e) {
    return res.status(200).json({ received: true, test: true, raw });
  }
});

/**
 * 2) PRODUCTION endpoint (WITH Svix verification)
 *    Point Clerk -> https://yourdomain.com/api/webhook
 */
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("▶︎ /api/webhook hit");
  console.log("🔐 Secret loaded?", !!WEBHOOK_SECRET);

  if (!WEBHOOK_SECRET) {
    return res
      .status(500)
      .json({ error: "Server misconfigured: missing CLERK_WEBHOOK_SECRET" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(req.body, req.headers);
    console.log(`✅ Verified: ${evt.type}`);

    // Upsert into DB
    await handleClerkEvent(evt);

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }
});

router.get("/", (req, res) => {
  res.json({ message: "Webhook endpoint is up and running!" });
});

module.exports = router;

/* -------------------------------
   Helper: upsert/delete user
-------------------------------- */
async function handleClerkEvent(evt) {
  const { type, data } = evt;

  switch (type) {
    case "user.created":
    case "user.updated": {
      const clerkId = data.id;
      // safest way to get email
      const primaryEmailId = data.primary_email_address_id;
      const primaryEmail =
        data.email_addresses?.find((e) => e.id === primaryEmailId)
          ?.email_address || data.email_addresses?.[0]?.email_address;

      const firstName = data.first_name || "";
      const lastName = data.last_name || "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

      const imageUrl = data.image_url;
      const phone = data.phone_numbers?.[0]?.phone_number;

      await User.findOneAndUpdate(
        { clerkId },
        {
          $set: {
            clerkId,
            email: primaryEmail,
            firstName,
            lastName,
            fullName,
            imageUrl,
            phone,
            status: "active",
            metadata: data.public_metadata || {},
          },
        },
        { upsert: true, new: true }
      );

      console.log(`🆙 Upserted user with clerkId=${clerkId}`);
      break;
    }

    case "user.deleted": {
      const clerkId = data.id;
      // Option 1: hard delete
      // await User.findOneAndDelete({ clerkId });

      // Option 2: soft delete / mark inactive
      await User.findOneAndUpdate(
        { clerkId },
        { $set: { status: "inactive" } }
      );

      console.log(`🗑️ Marked user inactive with clerkId=${clerkId}`);
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event: ${type}`);
  }
}

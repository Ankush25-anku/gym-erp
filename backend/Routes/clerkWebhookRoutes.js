// Routes/clerkWebhookRoutes.js
const express = require("express");
const router = express.Router();
const ClerkUser = require("../models/ClerkUser");

router.post("/webhook", async (req, res) => {
  const event = req.body;

  try {
    if (event.type === "user.created") {
      const userData = event.data;
      const fullName = `${userData.first_name} ${userData.last_name}`.trim();

      await ClerkUser.findOneAndUpdate(
        { sub: userData.id },
        {
          sub: userData.id,
          email: userData.email_addresses?.[0]?.email_address || "",
          first_name: userData.first_name,
          last_name: userData.last_name,
          fullName,
          role: userData.public_metadata?.role || "User",
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Webhook handled" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

module.exports = router;

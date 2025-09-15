// middleware/verifyClerkToken.js
const { verifyToken, createClerkClient } = require("@clerk/backend");

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const verifyClerkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🔐 Incoming Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No Bearer token" });
    }

    const token = authHeader.split(" ")[1];

    // 🛡️ Verify the token
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    console.log("✅ Token verified. Payload:", payload);

    // 👤 Fetch user info from Clerk
    const user = await clerk.users.getUser(payload.sub);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found in Clerk" });
    }

    req.clerkUser = {
      sub: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      first_name: user.firstName || "",
      last_name: user.lastName || "",
      role: user.publicMetadata?.role || "member",
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyClerkToken;


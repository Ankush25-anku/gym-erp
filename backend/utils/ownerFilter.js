// utils/ownerFilter.js

/**
 * Returns a MongoDB filter to restrict queries
 * to documents owned by the currently logged-in Clerk user.
 */
function ownerFilter(req, extra = {}) {
  if (!req.clerkUser) {
    return extra; // fallback: no restriction
  }

  // Prefer ownerClerkId since you save it on Member documents
  const filter = {
    ownerClerkId: req.clerkUser.sub,
  };

  return { ...extra, ...filter };
}

module.exports = ownerFilter;

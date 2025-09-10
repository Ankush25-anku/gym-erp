"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useUser, getToken, useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/plans";
const AUTH_API = process.env.NEXT_PUBLIC_API_URL + "/api/auth/me";
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51ReUX4Ac20Y0oZklDvhJqek3MHXp8Ua1I15FINyK5vJSbT8vzMGXov9eqKVzS45oFSkEbGvI7pBq2ysatTzVeJR800Mhl3jqDu";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (user) {
      const email = user?.primaryEmailAddress?.emailAddress || "";
      setUserEmail(email);
      console.log("✅ Set userEmail from user:", email);
    }
  }, [user]);

  const [gymId, setGymId] = useState("");
  const { getToken, userId } = useAuth();

  const [newPlan, setNewPlan] = useState({
    name: "",
    monthlyPrice: "",
    yearlyPrice: "",
    type: "month",
    duration: "",
    features: "",
    members: "",
    status: "active",
    popular: false,
  });

  // Fetch logged-in user's email and then fetch their plans

  useEffect(() => {
    const init = async () => {
      if (!isLoaded || !user) return;

      try {
        const token = await getToken();
        const fetchedGymId = await fetchGymId(token);
        setGymId(fetchedGymId);
        console.log("📦 Gym ID set in state:", fetchedGymId);
      } catch (err) {
        console.error("❌ Error fetching gymId:", err.message);
      }
    };

    init();
  }, [isLoaded, user]);

  const fetchPlans = async () => {
    try {
      const token = await getToken(); // ⬅️ Get the token here
      const res = await axios.get(API_URL, {
        params: { userEmail, gymId },
        headers: {
          Authorization: `Bearer ${token}`, // ⬅️ Pass token here
        },
      });
      setPlans(res.data);
    } catch (err) {
      console.error("⚠️ Error fetching plans:", err);
    }
  };

  const fetchGymId = async (token) => {
    try {
      const role =
        user?.publicMetadata?.role || user?.unsafeMetadata?.role || "member";
      console.log("🔍 Role detected:", role);

      const gymUrl =
        role === "superadmin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/gyms`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/gyms/my`;

      console.log("🌐 Fetching gym from URL:", gymUrl);

      const res = await axios.get(gymUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Gym fetch response:", res.data);

      const gyms = Array.isArray(res.data) ? res.data : res.data.gyms || [];
      const gymId = gyms[0]?._id || "";

      console.log("🏋️‍♂️ Resolved Gym ID:", gymId);

      return gymId;
    } catch (err) {
      console.error(
        "❌ Failed to fetch gym ID:",
        err.response?.data || err.message
      );
      return "";
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const fetchedGymId = await fetchGymId(token);
        setGymId(fetchedGymId);
        console.log("📦 Gym ID set in state:", fetchedGymId);
      } catch (err) {
        console.error("❌ Error in init:", err.message);
      }
    };

    init();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const token = await getToken(); // Get Clerk token

      // Soft delete: set isDeleted = true
      await axios.put(
        `${API_URL}/${id}`,
        { isDeleted: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from UI without deleting from DB
      setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== id));
    } catch (err) {
      console.error(
        "Failed to delete plan:",
        err.response?.data || err.message
      );
    }
  };

  const handleAddPlan = async () => {
    try {
      const token = await getToken();

      const userEmail = user?.primaryEmailAddress?.emailAddress || "";

      console.log("🔍 Debug Info:");
      console.log("User object:", user);
      console.log("User Email:", userEmail);
      console.log("Clerk User ID:", user?.id);
      console.log("Gym ID:", gymId);

      if (!userEmail || !user?.id || !gymId) {
        alert("User info missing. Please log in again.");
        return;
      }

      const payload = {
        ...newPlan,
        monthlyPrice: parseFloat(newPlan.monthlyPrice),
        yearlyPrice: parseFloat(newPlan.yearlyPrice),
        members: parseInt(newPlan.members),
        features: newPlan.features.split(",").map((f) => f.trim()),
        userEmail,
        clerkUserId: user.id,
        gymId,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let res;
      if (newPlan._id) {
        res = await axios.put(`${API_URL}/${newPlan._id}`, payload, {
          headers,
        });
        setPlans((prev) =>
          prev.map((p) => (p._id === newPlan._id ? res.data : p))
        );
      } else {
        res = await axios.post(API_URL, payload, { headers });
        setPlans([...plans, res.data]);
      }

      setShowModal(false);
      setNewPlan({
        name: "",
        monthlyPrice: "",
        yearlyPrice: "",
        type: "month",
        duration: "",
        features: "",
        members: "",
        status: "active",
        popular: false,
      });
    } catch (err) {
      console.error("Failed to save plan:", err?.response?.data || err.message);
      alert("Failed to save plan. Check required fields.");
    }
  };

  const handleStripeCheckout = async (plan) => {
    try {
      const stripe = await stripePromise;
      const res = await axios.post(`${API_URL}/create-checkout-session`, {
        planId: plan._id,
      });
      await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    } catch (err) {
      console.error("Stripe error:", err.response?.data || err.message);
      alert("Payment failed. Please try again.");
    }
  };

  const totalMembers = plans.reduce((sum, p) => sum + (p.members || 0), 0);
  const totalRevenue = plans.reduce((sum, p) => {
    const price = p.type === "year" ? p.yearlyPrice : p.monthlyPrice;
    return sum + (price || 0) * (p.members || 0);
  }, 0);
  const activePlans = plans.filter((p) => p.status === "active").length;

  const handleStripePayment = async (plan) => {
    try {
      const res = await axios.post(`${API_URL}/pay/stripe`, {
        planId: plan._id,
      });
      const { clientSecret } = res.data;
      const stripe = await stripePromise;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: { token: "tok_visa" }, // For testing only
        },
      });

      if (result.error) {
        alert("Payment failed. Please try again.");
      } else {
        // Confirm payment and update DB
        await axios.post(`${API_URL}/payment/success`, { planId: plan._id });

        alert("Payment successful!");
        fetchPlans(); // Refresh the UI to reflect updated member count
      }
    } catch (err) {
      console.error("Stripe error:", err.response?.data || err.message);
      alert("Payment failed. Please try again.");
    }
  };
  useEffect(() => {
    if (userEmail && gymId) {
      fetchPlans();
    }
  }, [userEmail, gymId]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Subscription Plans</h2>
          <p className="text-muted mb-0">
            Manage membership plans, pricing, and features
          </p>
        </div>
        <Button variant="dark" onClick={() => setShowModal(true)}>
          + Add Plan
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search plans..."
        />
      </div>

      <div className="row">
        {plans.map((plan) => (
          <div className="col-md-3 mb-4" key={plan._id}>
            <div
              className={`card h-100 border ${
                plan.popular ? "border-primary" : "border-light"
              } position-relative`}
            >
              {plan.popular && (
                <span
                  className="position-absolute top-0 start-50 translate-middle badge bg-primary"
                  style={{ zIndex: 1 }}
                >
                  Most Popular
                </span>
              )}
              <div className="card-body">
                <h5 className="fw-bold">{plan.name}</h5>
                <h3 className="fw-bold">
                  {plan.type === "year"
                    ? `₹${plan.yearlyPrice?.toFixed(2)}`
                    : `₹${plan.monthlyPrice?.toFixed(2)}`}{" "}
                  <small className="text-muted fs-6">/{plan.type}</small>
                </h3>

                <p className="text-muted small mb-2">
                  <i className="bi bi-clock me-1"></i> {plan.duration}
                </p>
                <ul className="list-unstyled small mb-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="mb-1">
                      ✅ {feat}
                    </li>
                  ))}
                </ul>
                <p className="text-muted small mb-1">
                  👥 Current Members: <strong>{plan.members}</strong>
                </p>
                <p className="text-muted small">
                  Status:{" "}
                  <span className="badge bg-success text-capitalize">
                    {plan.status}
                  </span>
                </p>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-between">
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => {
                    setNewPlan({
                      ...plan,
                      features: plan.features.join(", "),
                    });
                    setShowModal(true);
                  }}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(plan._id)}
                >
                  🖑️
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleStripeCheckout(plan)}
                >
                  💳 Pay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 d-flex flex-row align-items-center gap-3">
            <div className="bg-primary rounded p-2">
              <i className="bi bi-currency-dollar text-white fs-4"></i>
            </div>
            <div>
              <div className="text-muted small">Total Revenue</div>
              <h5 className="mb-0 fw-bold">₹{totalRevenue.toFixed(2)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-3 mt-md-0">
          <div className="card shadow-sm border-0 p-3 d-flex flex-row align-items-center gap-3">
            <div className="bg-success rounded p-2">
              <i className="bi bi-people text-white fs-4"></i>
            </div>
            <div>
              <div className="text-muted small">Total Members</div>
              <h5 className="mb-0 fw-bold">{totalMembers}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-3 mt-md-0">
          <div className="card shadow-sm border-0 p-3 d-flex flex-row align-items-center gap-3">
            <div
              className="bg-purple rounded p-2"
              style={{ backgroundColor: "#a855f7" }}
            >
              <i className="bi bi-clock text-white fs-4"></i>
            </div>
            <div>
              <div className="text-muted small">Active Plans</div>
              <h5 className="mb-0 fw-bold">{activePlans}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Plan */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {newPlan._id ? "Edit Plan" : "Add New Plan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newPlan.name}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Monthly Price</Form.Label>
              <Form.Control
                type="number"
                value={newPlan.monthlyPrice}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, monthlyPrice: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Yearly Price</Form.Label>
              <Form.Control
                type="number"
                value={newPlan.yearlyPrice}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, yearlyPrice: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newPlan.type}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, type: e.target.value })
                }
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Features (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={newPlan.features}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, features: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Members</Form.Label>
              <Form.Control
                type="number"
                value={newPlan.members}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, members: e.target.value })
                }
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Mark as Popular"
              checked={newPlan.popular}
              onChange={(e) =>
                setNewPlan({ ...newPlan, popular: e.target.checked })
              }
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPlan}>
            Save Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;

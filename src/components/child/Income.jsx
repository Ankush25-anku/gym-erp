"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useUser, useAuth } from "@clerk/nextjs";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/income`;

const Income = () => {
  const { user } = useUser();
  const [incomeList, setIncomeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [gymId, setGymId] = useState(null);
  const { getToken } = useAuth();

  // 🟡 Log entire user object for debugging
  console.log("🧑 Clerk user:", user);

  // const gymId = user?.publicMetadata?.gymId;
  const clerkId = user?.id;

  console.log("🏋️ gymId from Clerk metadata:", gymId);
  console.log("🧾 clerkId:", clerkId);

  const fetchIncomes = async () => {
    if (!clerkId || !gymId) return;
    try {
      const res = await axios.get(API, {
        params: { gymId },
        headers: {
          "x-clerk-user-id": clerkId,
        },
      });
      const filtered = res.data.filter((entry) => !entry.isDeleted);
      setIncomeList(filtered);
    } catch (err) {
      console.error("Failed to fetch incomes", err);
    }
  };

  useEffect(() => {
    if (clerkId && gymId) {
      fetchIncomes();
    }
  }, [clerkId, gymId]);

  const openAddModal = () => {
    setEditingIncome({
      source: "",
      amount: "",
      date: "",
      paymentMethod: "",
      referenceId: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (income) => {
    setEditingIncome({ ...income });
    setShowModal(true);
  };

  useEffect(() => {
    const fetchGymId = async () => {
      try {
        const token = await getToken();
        if (!user || !token) return;

        const role =
          user?.publicMetadata?.role || user?.unsafeMetadata?.role || "member";

        const url =
          role === "superadmin"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/gyms`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/gyms/my`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const gyms = Array.isArray(res.data) ? res.data : res.data.gyms || [];
        const selectedGym = gyms[0];
        setGymId(selectedGym?._id);

        console.log("✅ Gym fetched:", selectedGym);
      } catch (err) {
        console.error("❌ Failed to fetch gym:", err);
      }
    };

    if (user) fetchGymId();
  }, [user]);
  const handleSave = async () => {
    try {
      const token = await getToken();
      const clerkId = user?.id;

      if (!clerkId || !token) {
        console.error("❌ Missing clerkId or token");
        return;
      }

      // Get gymId again to be safe
      const role =
        user?.publicMetadata?.role || user?.unsafeMetadata?.role || "member";
      const gymUrl =
        role === "superadmin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/gyms`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/gyms/my`;

      const gymRes = await axios.get(gymUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const gymList = Array.isArray(gymRes.data)
        ? gymRes.data
        : gymRes.data.gyms || [];
      const gymId = gymList?.[0]?._id;

      if (!gymId) {
        console.error("❌ No gym found for this user.");
        return;
      }

      // Validate fields
      if (
        !editingIncome.source?.trim() ||
        !editingIncome.amount ||
        !editingIncome.date ||
        !editingIncome.paymentMethod
      ) {
        alert("Please fill all required fields.");
        return;
      }

      const payload = {
        gymId,
        source: editingIncome.source.trim(),
        amount: Number(editingIncome.amount),
        date: new Date(editingIncome.date),
        paymentMethod: editingIncome.paymentMethod.trim(),
        referenceId: editingIncome.referenceId?.trim() || "",
        description: editingIncome.description?.trim() || "",
        clerkId, // Also saving Clerk ID now
      };

      console.log("📦 Payload to send:", payload);

      const res = await axios.post(API, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": clerkId,
        },
      });

      console.log("✅ Income saved:", res.data);
      setShowModal(false);
      fetchIncomes();
    } catch (err) {
      console.error(
        "❌ Error saving income:",
        err?.response?.data || err.message
      );
      alert("Failed to save income. Check required fields.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this income entry?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          "x-clerk-user-id": clerkId,
        },
      });
      fetchIncomes();
    } catch (err) {
      console.error("❌ Failed to soft delete:", err);
      alert("Failed to delete income entry.");
    }
  };

  return (
    <MasterLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Gym Income</h2>
          <Button onClick={openAddModal}>+ Add Income</Button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Reference ID</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.source}</td>
                  <td>₹{entry.amount}</td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.paymentMethod}</td>
                  <td>{entry.referenceId}</td>
                  <td>{entry.description}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(entry._id)}
                    >
                      🗑
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingIncome?._id ? "Edit Income" : "Add Income"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Source</Form.Label>
                <Form.Control
                  type="text"
                  value={editingIncome?.source || ""}
                  onChange={(e) =>
                    setEditingIncome((prev) => ({
                      ...prev,
                      source: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editingIncome?.amount || ""}
                  onChange={(e) =>
                    setEditingIncome((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    editingIncome?.date
                      ? new Date(editingIncome.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditingIncome((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  type="text"
                  value={editingIncome?.paymentMethod || ""}
                  onChange={(e) =>
                    setEditingIncome((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Reference ID</Form.Label>
                <Form.Control
                  type="text"
                  value={editingIncome?.referenceId || ""}
                  onChange={(e) =>
                    setEditingIncome((prev) => ({
                      ...prev,
                      referenceId: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editingIncome?.description || ""}
                  onChange={(e) =>
                    setEditingIncome((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </MasterLayout>
  );
};

export default Income;

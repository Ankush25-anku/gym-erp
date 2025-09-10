"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useUser, useAuth } from "@clerk/nextjs";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/expenses`;

export default function ExpensesPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [gymId, setGymId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchGymId = async (token) => {
    try {
      const role =
        user?.publicMetadata?.role || user?.unsafeMetadata?.role || "member";

      const gymUrl =
        role === "superadmin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/gyms`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/gyms/my`;

      const res = await axios.get(gymUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": user.id,
        },
      });

      const gyms = Array.isArray(res.data) ? res.data : res.data.gyms || [];
      return gyms[0]?._id || "";
    } catch (err) {
      console.error(
        "❌ Error fetching gymId:",
        err.response?.data || err.message
      );
      return "";
    }
  };

  const fetchExpenses = async (token, currentGymId) => {
    try {
      const res = await axios.get(`${API}?gymId=${currentGymId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": user.id,
        },
      });
      setExpenses(res.data || []);
    } catch (err) {
      console.error(
        "❌ Error fetching expenses:",
        err.response?.data || err.message
      );
    }
  };

  const fetchTotal = async (token, currentGymId) => {
    try {
      const res = await axios.get(`${API}/total?gymId=${currentGymId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": user.id,
        },
      });
      setTotalExpense(res.data?.total || 0);
    } catch (err) {
      console.error(
        "❌ Error fetching total:",
        err.response?.data || err.message
      );
      setTotalExpense(0);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!isLoaded || !user) return;
      const token = await getToken();
      if (!token) return;

      const foundGymId = await fetchGymId(token);
      if (!foundGymId) return;
      setGymId(foundGymId);

      await fetchExpenses(token, foundGymId);
      await fetchTotal(token, foundGymId);
    };

    init();
  }, [isLoaded]);

  const openAddModal = () => {
    setEditingExpense({
      category: "",
      amount: "",
      paidTo: "",
      paymentMethod: "",
      description: "",
      receiptUrl: "",
      date: new Date(),
    });
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense({ ...expense });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!user || !isLoaded || !gymId) return;

    const token = await getToken();
    const payload = {
      ...editingExpense,
      amount: parseFloat(editingExpense.amount),
      gymId,
      clerkUserId: user.id,
      date: new Date(editingExpense.date).toISOString(),
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-clerk-user-id": user.id,
      };

      if (editingExpense._id) {
        await axios.put(`${API}/${editingExpense._id}`, payload, { headers });
      } else {
        await axios.post(API, payload, { headers });
      }

      setShowModal(false);
      setEditingExpense(null);
      await fetchExpenses(token, gymId);
      await fetchTotal(token, gymId);
    } catch (err) {
      alert("❌ Failed to save expense.");
      console.error("Save Error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    const token = await getToken();

    try {
      await axios.delete(`${API}/${id}`,
          { isDeleted: true },
           {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": user.id,
        },
      });

      await fetchExpenses(token, gymId);
      await fetchTotal(token, gymId);
    } catch (err) {
      alert("❌ Failed to delete expense.");
      console.error("Delete Error:", err.response?.data || err.message);
    }
  };

  return (
    <MasterLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Gym Expenses</h2>
          <Button onClick={openAddModal}>+ Add Expense</Button>
        </div>

        <div className="mb-4">
          <h5>Total Expense: ₹{totalExpense.toLocaleString("en-IN")}</h5>
        </div>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Amount (₹)</th>
              <th>Paid To</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Description</th>
              <th>Receipt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id}>
                <td>{e.category}</td>
                <td>₹{e.amount}</td>
                <td>{e.paidTo}</td>
                <td>{e.paymentMethod}</td>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.description || "-"}</td>
                <td>
                  {e.receiptUrl ? (
                    <a href={e.receiptUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openEditModal(e)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(e._id)}
                  >
                    🗑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingExpense?._id ? "Edit Expense" : "Add Expense"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {[
                { label: "Category", key: "category" },
                { label: "Amount", key: "amount", type: "number" },
                { label: "Paid To", key: "paidTo" },
                { label: "Payment Method", key: "paymentMethod" },
                { label: "Description", key: "description" },
                { label: "Receipt URL", key: "receiptUrl" },
              ].map((field) => (
                <Form.Group className="mb-2" key={field.key}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type={field.type || "text"}
                    value={editingExpense?.[field.key] || ""}
                    onChange={(e) =>
                      setEditingExpense((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              ))}

              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  selected={
                    editingExpense?.date
                      ? new Date(editingExpense.date)
                      : new Date()
                  }
                  onChange={(date) =>
                    setEditingExpense((prev) => ({
                      ...prev,
                      date,
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
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
}

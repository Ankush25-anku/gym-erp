"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useAuth, useUser } from "@clerk/nextjs";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/inventory`;

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [gymId, setGymId] = useState("");

  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const fetchInventory = async () => {
    try {
      const token = await getToken();
      if (!isLoaded || !user || !token) return;

      const role =
        user.publicMetadata?.role || user.unsafeMetadata?.role || "member";

      const gymUrl =
        role === "superadmin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/gyms`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/gyms/my`;

      const gymRes = await axios.get(gymUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const gyms = Array.isArray(gymRes.data)
        ? gymRes.data
        : gymRes.data.gyms || [];

      const selectedGym = gyms[0];
      const foundGymId = selectedGym?._id;
      if (!foundGymId) return;

      setGymId(foundGymId);

      const res = await axios.get(
        `${API}?gymId=${foundGymId}&isDeleted=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-clerk-user-id": user.id,
          },
        }
      );

      setInventoryItems(res.data);
    } catch (err) {
      console.error(
        "❌ Failed to fetch inventory:",
        err.response?.data || err.message
      );
    }
  };

  const openAddModal = () => {
    setEditingItem({ itemName: "", quantity: 0, status: "", notes: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      if (!isLoaded || !user || !token) return;

      const { itemName, quantity, status, notes, _id } = editingItem;
      if (!gymId || !itemName.trim() || quantity < 0 || !status) {
        alert("Please fill all required fields correctly.");
        return;
      }

      const payload = { itemName, quantity, status, notes, gymId };
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-clerk-user-id": user.id,
      };

      let res;
      if (_id) {
        res = await axios.put(`${API}/${_id}`, payload, { headers });
      } else {
        res = await axios.post(API, payload, { headers });
      }

      setShowModal(false);
      fetchInventory();
    } catch (err) {
      console.error("❌ Save failed:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = await getToken();
      if (!isLoaded || !user || !token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
        "x-clerk-user-id": user.id,
      };
      await axios.put(`${API}/${id}`, { isDeleted: true }, { headers });

      fetchInventory();
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert("Failed to delete item.");
    }
  };

  useEffect(() => {
    if (isLoaded) fetchInventory();
  }, [isLoaded]);

  return (
    <MasterLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Gym Inventory</h2>
          <Button onClick={openAddModal}>+ Add Item</Button>
        </div>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item) => (
              <tr key={item._id}>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
                <td>{item.notes || "-"}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openEditModal(item)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Form */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingItem?._id ? "Edit Item" : "Add New Item"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem?.itemName || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      itemName: e.target.value,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={editingItem?.quantity ?? 0}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editingItem?.status || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="In Use">In Use</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  type="text"
                  value={editingItem?.notes || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      notes: e.target.value,
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

export default Inventory;

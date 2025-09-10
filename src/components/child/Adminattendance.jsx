"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Row, Col, Badge } from "react-bootstrap";
import { Edit, Trash2, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth, useUser } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL;

const MemberAttendance = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [gymId, setGymId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [formData, setFormData] = useState({
    category: "Member",
    status: "Check-in",
    ownerClerkId: "",
    personId: "",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [members, setMembers] = useState([]);
  const [category, setCategory] = useState("Member");
  const [attendance, setAttendance] = useState([]); // ✅ Fixed: no prop, just state

  const fetchGymId = async (token) => {
    const role =
      user?.publicMetadata?.role || user?.unsafeMetadata?.role || "member";

    const gymUrl =
      role === "superadmin" ? `${API}/api/gyms` : `${API}/api/gyms/my`;

    const res = await axios.get(gymUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const gyms = Array.isArray(res.data) ? res.data : res.data.gyms || [];
    return gyms[0]?._id || "";
  };

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      const token = await getToken();
      const id = await fetchGymId(token);
      console.log("🏋️‍♂️ Set gymId:", id);
      setGymId(id);
    };
    init();
  }, [user]);

  // useEffect(() => {
  //   if (user && !editingId) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       ownerClerkId: user.id,
  //     }));
  //   }
  // }, [user, editingId]);

  const fetchAttendance = async () => {
    try {
      const token = await getToken();
      const formattedDate = selectedDate.toISOString().split("T")[0];
      console.log("📤 Sending attendance fetch request with:", {
        gymId,
        date: formattedDate,
      });

      const res = await axios.get(`${API}/api/admin/attendance`, {
        params: {
          gymId,
          date: formattedDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📅 Attendance fetched:", res.data);
      setAttendance(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch attendance:", err);
    }
  };

  useEffect(() => {
    if (gymId) {
      console.log("👀 Fetching attendance for gymId:", gymId);
      fetchAttendance();
    }
  }, [selectedDate, gymId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();

    const date = selectedDate.toISOString().split("T")[0];
    const { category, status, ownerClerkId, personId } = formData;

    console.log("📝 handleSubmit called with:");
    console.log("➡️ category:", category);
    console.log("➡️ ownerClerkId:", ownerClerkId);
    console.log("➡️ personId:", personId);
    console.log("➡️ status:", status);
    console.log("➡️ date:", date);
    console.log("➡️ gymId:", gymId);

    if (!ownerClerkId || !category || !status || !date || !gymId || !personId) {
      console.error("❌ Missing required fields:", formData);
      return;
    }

    const payload = {
      category,
      status,
      date,
      gymId,
      ownerClerkId,
      personId,
    };

    console.log("📤 Submitting formData:", formData);
    console.log("📦 Final payload to submit:", payload);

    try {
      if (editingId) {
        await axios.put(`${API}/api/admin/attendance/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📝 Updated existing attendance entry.");
      } else {
        await axios.post(`${API}/api/admin/attendance`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Attendance created successfully.");
      }

      await fetchAttendance(); // fetch latest entries
      await getPeopleList(); // 🟢 refresh person list used for name resolving

      setShowModal(false);
      setFormData({
        category: "Member",
        status: "Check-in",
        ownerClerkId: "",
        personId: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error submitting:", err?.response?.data || err.message);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setFormData({
      category: entry.category,
      status: entry.status,
      ownerClerkId: entry.ownerClerkId || "",
      personId: entry.personId || "",
    });

    setCategory(entry.category);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    try {
      await axios.delete(`${API}/api/admin/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAttendance();
    } catch (err) {
      console.error("Error deleting attendance", err);
    }
  };
  const getPeopleList = async () => {
    console.log("🔁 getPeopleList called for category:", category);

    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let endpoint = "";
      let updateList = null;

      if (category === "Member") {
        endpoint = `${API}/api/members`;
        updateList = setMembers;
      } else if (category === "Trainer") {
        endpoint = `${API}/api/admintrainers`;
        updateList = setTrainers;
      } else if (category === "Staff") {
        endpoint = `${API}/api/adminstaff`;
        updateList = setStaff;
      }

      console.log("🌐 Requesting people list:", {
        category,
        url: endpoint,
        params: { gymId },
      });

      const res = await axios.get(endpoint, {
        params: { gymId },
        headers,
      });

      if (!Array.isArray(res.data)) {
        console.error("❗ Expected array but got:", res.data);
        setPeopleList([]);
        return;
      }

      res.data.forEach((person, i) => {
        console.log(`👤 ${category} ${i + 1}:`, {
          id: person._id,
          fullname: person.fullname || person.name,
          ownerClerkId: person.ownerClerkId,
        });
      });

      setPeopleList(res.data);
      updateList?.(res.data); // 🟢 update respective global list too
    } catch (error) {
      console.error("❌ Error fetching people list:", error);
    }
  };

  useEffect(() => {
    if (showModal && category && gymId) {
      getPeopleList();
    }
  }, [showModal, category, gymId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const memberRes = await axios.get(`${API}/api/members`, {
          params: { gymId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const trainerRes = await axios.get(`${API}/api/admintrainers`, {
          params: { gymId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const staffRes = await axios.get(`${API}/api/adminstaff`, {
          params: { gymId },
          headers: { Authorization: `Bearer ${token}` },
        });

        setMembers(memberRes.data);
        setTrainers(trainerRes.data);
        setStaff(staffRes.data);
      } catch (error) {
        console.error("❌ Fetching Error:", error);
      }
    };

    if (gymId) {
      fetchData();
    }
  }, [gymId]);
  const getUserName = (entry) => {
    console.log("🔍 Resolving name for attendance entry:");
    console.log("📌 category:", entry.category);
    console.log("📌 ownerClerkId:", entry.ownerClerkId);
    console.log("📌 personId:", entry.personId);

    const normalizedPersonId = entry.personId?.toString();
    console.log("📌 normalizedPersonId:", normalizedPersonId);

    let people = [];

    if (entry.category === "Trainer") {
      people = trainers;
    } else if (entry.category === "Staff") {
      people = staff;
    } else if (entry.category === "Member") {
      people = members;
    }

    console.log("🗃️ Available people:", people);

    const match = people.find((p) => p._id === normalizedPersonId);

    console.log("✅ Matched person:", match);

    // 👇 Added `staffName` check
    return match?.fullname || match?.name || match?.staffName || "Unknown";
  };

  console.log("🧾 Selected ownerClerkId:", formData.ownerClerkId);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Attendance</h4>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Attendance
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="form-control"
          />
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {attendance?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No records found.
              </td>
            </tr>
          ) : (
            attendance.map((entry, index) => (
              <tr key={entry._id}>
                <td>{index + 1}</td> {/* ✅ Show row number properly */}
                <td>
                  {entry.personId ? (
                    getUserName(entry)
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>{entry.category}</td>
                <td>
                  <Badge
                    bg={entry.status === "Check-in" ? "success" : "danger"}
                  >
                    {entry.status}
                  </Badge>
                </td>
                <td>{new Date(entry.time).toLocaleTimeString()}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(entry._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Attendance" : "Add Attendance"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      setCategory(selectedCategory);
                      setFormData({
                        ...formData,
                        category: selectedCategory,
                        clerkUserId: "",
                      });
                    }}
                  >
                    <option>Member</option>
                    <option>Trainer</option>
                    <option>Staff</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Name</Form.Label>
                  <Form.Select
                    value={formData.personId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const person = peopleList.find(
                        (p) => p._id === selectedId
                      );
                      const clerkId = person?.ownerClerkId || "";

                      // ✅ Include staffName
                      const personName =
                        person?.fullname ||
                        person?.name ||
                        person?.staffName ||
                        "Unnamed";

                      console.log("🟢 Person selected from dropdown:");
                      console.log("➡️ personId (selectedId):", selectedId);
                      console.log("➡️ ownerClerkId:", clerkId);
                      console.log("➡️ name:", personName);
                      console.log("➡️ Current category:", formData.category);

                      setFormData((prev) => ({
                        ...prev,
                        ownerClerkId: clerkId,
                        personId: selectedId,
                      }));
                    }}
                  >
                    <option value="">-- Select --</option>
                    {peopleList.map((person, i) => {
                      const value = person._id;

                      // ✅ Include staffName for label
                      const label =
                        person.fullname ||
                        person.name ||
                        person.staffName ||
                        "Unnamed";

                      console.log("📋 Rendering <option>:", {
                        category,
                        display: label,
                        value,
                        ownerClerkId: person.ownerClerkId,
                      });

                      return (
                        <option key={`${value}_${i}`} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Check-in">Check-in</option>
                <option value="Check-out">Check-out</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid">
              <Button type="submit">{editingId ? "Update" : "Submit"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MemberAttendance;

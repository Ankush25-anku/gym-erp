// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

// export default function LoginPage() {
//   const router = useRouter();
//   const [isSignup, setIsSignup] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const toggleMode = () => {
//     setIsSignup(!isSignup);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const url = isSignup
//       ? `${API_BASE}/api/user-management/register`
//       : `${API_BASE}/api/user-management/login`;

//     try {
//       const payload = isSignup
//         ? {
//             name: formData.name,
//             email: formData.email,
//             password: formData.password,
//           }
//         : { email: formData.email, password: formData.password };

//       const res = await axios.post(url, payload);
//       console.log("✅ Auth response:", res.data);

//       if (isSignup) {
//         alert("✅ Registration successful! You can now log in.");
//         toggleMode(); // Switch to login
//         return;
//       }

//       const { token, user } = res.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("userId", user._id);
//         localStorage.setItem("userRole", user.role);
//         localStorage.setItem("gymId", user.gymId);
//       }
//       // ✅ store full user object

//       // Redirect based on role
//       if (user.role === "superadmin") router.push("/superadmin");
//       else if (user.role === "admin") router.push("/admin");
//       else if (user.role === "trainer") router.push("/trainer");
//       else if (user.role === "member") router.push("/member");
//       else if (user.role === "staff") router.push("/staff");
//     } catch (err) {
//       console.error("❌ Auth error:", err);
//       alert(err.response?.data?.error || err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: "400px" }}>
//       <h3 className="mb-3 text-center">{isSignup ? "Sign Up" : "Login"}</h3>

//       <form onSubmit={handleSubmit}>
//         {isSignup && (
//           <div className="mb-3">
//             <input
//               type="text"
//               name="name"
//               className="form-control"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         )}

//         <div className="mb-3">
//           <input
//             type="email"
//             name="email"
//             className="form-control"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <input
//             type="password"
//             name="password"
//             className="form-control"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit" className="btn btn-primary w-100">
//           {isSignup ? "Sign Up" : "Login"}
//         </button>
//       </form>

//       <p className="mt-3 text-center">
//         {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//         <button className="btn btn-link p-0" type="button" onClick={toggleMode}>
//           {isSignup ? "Login here" : "Sign up here"}
//         </button>
//       </p>
//     </div>
//   );
// }

// app/login/page.js
// app/login/page.js
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return <SignIn afterSignInUrl="/dashboard" />;
}

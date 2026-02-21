import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    registrationNumber: "",
    password: "",
  });

  const roles = [
    { name: "Student", value: "student", registrationNumber: "STU001", password: "password123" },
    { name: "Faculty", value: "faculty", email: "faculty@gmail.com", password: "password123" },
    { name: "HOD", value: "hod", email: "hod@gmail.com", password: "password123" },
    { name: "Admin", value: "admin", email: "admin@gmail.com", password: "password123" },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const newFormData = { password: role.password };
    
    if (role.value === 'student') {
      newFormData.registrationNumber = role.registrationNumber;
      newFormData.email = "";
    } else {
      newFormData.email = role.email;
      newFormData.registrationNumber = "";
    }
    
    setFormData(newFormData);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginIdentifier = selectedRole.value === 'student' ? formData.registrationNumber : formData.email;
      await login(loginIdentifier, formData.password);
      toast.success(`Welcome! Login successful as ${selectedRole.name}`);
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-system-blue bg-opacity-5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-system-blue bg-opacity-5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="relative w-full max-w-6xl">
        {!selectedRole ? (
          // Role Selection Screen
          <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-system-blue bg-opacity-10 mb-6">
                <AcademicCapIcon className="w-8 h-8 text-system-blue" />
              </div>
              <h1 className="text-5xl font-bold text-apple-text mb-2">Academic Portal</h1>
              <p className="text-lg text-apple-gray">Access your department resources</p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mb-12">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelect(role)}
                  className="card-apple group cursor-pointer hover:shadow-apple-lg hover:border-system-blue/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-system-blue bg-opacity-10 flex items-center justify-center text-xl group-hover:bg-opacity-20 transition-colors">
                        {role.value === 'student' && '🎓'}
                        {role.value === 'faculty' && '👨‍🏫'}
                        {role.value === 'hod' && '👔'}
                        {role.value === 'admin' && '⚙️'}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-apple-text mb-1">{role.name}</h3>
                      <p className="text-sm text-apple-gray">
                        {role.value === 'student' && 'Access course materials and submit assignments'}
                        {role.value === 'faculty' && 'Manage and share teaching materials'}
                        {role.value === 'hod' && 'Department oversight and approvals'}
                        {role.value === 'admin' && 'System administration'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-system-blue bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center text-system-blue opacity-0 group-hover:opacity-100 transition-all">
                        →
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer Help */}
            <p className="text-center text-apple-gray text-sm max-w-md">
              Each role has demo credentials pre-filled for testing the application
            </p>
          </div>
        ) : (
          // Login Form
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setFormData({ email: "", registrationNumber: "", password: "" });
                  setError("");
                }}
                className="mb-8 text-system-blue hover:text-system-blue-hover font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all"
              >
                ← Back to roles
              </button>

              {/* Form Card */}
              <div className="card-apple">
                {/* Header */}
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-full bg-system-blue bg-opacity-10 flex items-center justify-center text-2xl mb-4">
                    {selectedRole.value === 'student' && '🎓'}
                    {selectedRole.value === 'faculty' && '👨‍🏫'}
                    {selectedRole.value === 'hod' && '👔'}
                    {selectedRole.value === 'admin' && '⚙️'}
                  </div>
                  <h2 className="text-2xl font-bold text-apple-text mb-1">{selectedRole.name} Login</h2>
                  <p className="text-apple-gray">Sign in to your account</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-apple-lg">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Demo Credentials */}
                <div className="mb-6 p-4 bg-system-blue bg-opacity-5 border border-system-blue border-opacity-30 rounded-apple-lg">
                  <p className="text-xs font-semibold text-system-blue mb-2">DEMO CREDENTIALS</p>
                  <div className="space-y-1 text-sm text-apple-text">
                    {selectedRole.value === 'student' ? (
                      <p>ID: <code className="bg-white px-2 py-1 rounded font-mono text-xs">{selectedRole.registrationNumber}</code></p>
                    ) : (
                      <p>Email: <code className="bg-white px-2 py-1 rounded font-mono text-xs">{selectedRole.email}</code></p>
                    )}
                    <p>Password: <code className="bg-white px-2 py-1 rounded font-mono text-xs">{selectedRole.password}</code></p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Input Field */}
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">
                      {selectedRole.value === 'student' ? 'Registration Number' : 'Email Address'}
                    </label>
                    <input
                      type={selectedRole.value === 'student' ? 'text' : 'email'}
                      name={selectedRole.value === 'student' ? 'registrationNumber' : 'email'}
                      value={selectedRole.value === 'student' ? formData.registrationNumber : formData.email}
                      onChange={handleChange}
                      placeholder={selectedRole.value === 'student' ? 'STU001' : 'name@email.com'}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-apple-text mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-apple w-full mt-6"
                  >
                    {loading ? "Signing in..." : `Sign In as ${selectedRole.name}`}
                  </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-apple-gray">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-system-blue font-semibold hover:text-system-blue-hover transition-colors">
                      Create one
                    </Link>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 text-xs text-apple-gray">
                <p>🔒 Secure login with JWT authentication</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

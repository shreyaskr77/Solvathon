import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    password: "",
    semester: 1,
    role: 'Student',
    course: 'BCA',
  });

  const roles = ['Student', 'Faculty', 'HOD'];
  const courses = ['BCA', 'BA', 'BCOM', 'BSC', 'BBA', 'Other'];

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
      const submitData = { ...formData };
      if (formData.role !== 'Student') {
        delete submitData.course;
        delete submitData.semester;
        delete submitData.registrationNumber;
      } else {
        if (!formData.email && !formData.registrationNumber) {
          setError("Please provide either email or registration number");
          setLoading(false);
          return;
        }
      }
      delete submitData.department;
      await register(submitData);
      toast.success(`Registration successful! Welcome ${formData.name}`);
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Registration failed";
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

      <div className="relative w-full max-w-md">
        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="mb-8 text-system-blue hover:text-system-blue-hover font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all"
        >
          ← Back to login
        </button>

        {/* Form Card */}
        <div className="card-apple">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-system-blue bg-opacity-10 mb-4">
              <AcademicCapIcon className="w-7 h-7 text-system-blue" />
            </div>
            <h1 className="text-2xl font-bold text-apple-text mb-2">Create Account</h1>
            <p className="text-sm text-apple-gray">Join Academic Portal today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-apple-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-apple-text mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Role-Specific Fields */}
            {formData.role === 'Student' ? (
              <>
                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-semibold text-apple-text mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g., STU001"
                    className="w-full"
                  />
                </div>

                {/* Email (Optional for Students) */}
                <div>
                  <label className="block text-sm font-semibold text-apple-text mb-2">
                    Email Address <span className="text-apple-gray font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-semibold text-apple-text mb-2">Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full"
                  >
                    {courses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-semibold text-apple-text mb-2">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              /* Email for Faculty and HOD */
              <div>
                <label className="block text-sm font-semibold text-apple-text mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>
            )}

            {/* Password */}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-apple-gray">
              Already have an account?{" "}
              <Link to="/login" className="text-system-blue font-semibold hover:text-system-blue-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-apple-gray">
          <p>🔒 Your data is secure with us</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

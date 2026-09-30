"use client";
import { Input } from "../../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { Mail, Phone, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { loginUser, resetPassword, sendOtp } from "@/service/auth";
import { setAuthCookies } from "@/lib/cookies";

interface LoginFormProps {
  phoneNumber: string;
  onPhoneChange: (value: string) => void;
  onSendOTP: () => void;
  onEmailLogin: () => void;
}
export default function LoginForm({ phoneNumber, onPhoneChange, onSendOTP, onEmailLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState("email");
  const [userdetails, setuserdetails] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotForm, setForgotForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();


  console.log("LoginForm rendered with tab:", showPassword);

  const handleSubmit = async () => {
    try {
      if (tab === 'email') {
        const response = await loginUser(userdetails);

        // response.data is an array → [token, role]
        const token = response[0];
        const role = response[1];

        console.log("Login token:", token);
        console.log("User role:", role);

        // Save token in cookies
        setAuthCookies({
          accessToken: token,
          refreshToken: "", // no refresh token provided by backend
          role: role,
          user: { username: userdetails.username },
        });
        router.push(`/dashboard`);
      } else {
        // You might want to pass the phone number in the payload
        const res = await sendOtp({ phoneNumber });
        if (res.status === 200) {
          onSendOTP();
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.log("User not authorized");
        setError("Unauthorized access: invalid credentials");
      } else {
        console.error("Login failed", error);
        setError("Something went wrong. Please try again.");
      }
    }
    // tab === "phone" ? onSendOTP() : onEmailLogin();
    console.log("handleSubmit end :");
  };

  return (
    <div className="space-y-6 w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#13271f" }}>Welcome</h2>
        <p className="text-gray-600">Sign in to access your dashboard</p>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowForgot(false);
                setForgotForm({ email: "", password: "", confirmPassword: "" });
                setForgotError("");
                setForgotSuccess("");
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Reset Password</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setForgotError("");
                setForgotSuccess("");
                if (!forgotForm.email || !forgotForm.password || !forgotForm.confirmPassword) {
                  setForgotError("All fields are required.");
                  return;
                }
                if (forgotForm.password !== forgotForm.confirmPassword) {
                  setForgotError("Password and Confirm Password must match.");
                  return;
                }
                setForgotLoading(true);
                try {
                  const res = await resetPassword({
                    email: forgotForm.email,
                    password: forgotForm.password,
                    confirmPassword: forgotForm.confirmPassword,
                  });
                  // If backend returns a string or object, show success
                  setForgotSuccess(res?.message || res || "Password Reset Successfully");
                  setForgotForm({ email: "", password: "", confirmPassword: "" });
                } catch (err: any) {
                  setForgotError(err?.response?.data || "Failed to reset password.");
                } finally {
                  setForgotLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotForm.email}
                  onChange={e => setForgotForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="forgot-password" className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
                <Input
                  id="forgot-password"
                  type="password"
                  value={forgotForm.password}
                  onChange={e => setForgotForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="forgot-confirm" className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
                <Input
                  id="forgot-confirm"
                  type="password"
                  value={forgotForm.confirmPassword}
                  onChange={e => setForgotForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="w-full"
                  required
                />
              </div>
              {forgotError && <div className="text-red-600 text-sm text-center">{forgotError}</div>}
              {forgotSuccess && <div className="text-green-600 text-sm text-center">{forgotSuccess}</div>}
              <Button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)" }}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <Tabs defaultValue="email" className="" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="email">
            <Mail size={16} /> Email
          </TabsTrigger>
          <TabsTrigger value="phone">
            <Phone size={16} /> Phone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">UserName</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Mail size={18} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <Input id="email" type="text" value={userdetails.username}  onChange={(e) => setuserdetails({ ...userdetails, username: e.target.value })} placeholder="Enter your UserName" className="pl-12" />
            </div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700 mt-4">Password</label>
            <div className="relative group">
              <div className="absolute pt-5 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock size={18} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} onChange={(e) => setuserdetails({ ...userdetails, password: e.target.value })} value={userdetails.password}  placeholder="Enter your password" className="pl-12 pr-12" />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="phone">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Phone size={18} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <Input id="phone" type="text" placeholder="Enter your phone number" className="pl-12" value={phoneNumber} onChange={(e) => onPhoneChange(e.target.value)} />
            </div>
          </div>
        </TabsContent>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
            <label htmlFor="remember-me" className="ml-3 text-sm text-gray-600">Remember me</label>
          </div>
          <Button variant="link" type="button" onClick={() => setShowForgot(true)}>Forgot password?</Button>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
          style={{ background: "linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)" }}
        >
          {tab === "phone" ? "Send OTP" : "Sign In"}
        </Button>
        {error && (
          <div className="text-red-600 text-sm mt-2 text-center">
            {error}
          </div>
        )}
      </Tabs>

      <div className="flex justify-center gap-1 items-center w-full text-sm text-gray-600">
        {/* Additional links or info can go here */}
      </div>
    </div>
  );
}

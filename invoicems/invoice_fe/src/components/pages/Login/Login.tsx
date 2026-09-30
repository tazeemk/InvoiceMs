"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { OTPDialog } from "./OTPDialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { companyDetails } from "@/lib/company";
import KeyarLogo from "@/components/KeyarLogo";

export default function Login() {
  const [otpDialog, setOtpDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOTP = () => {
    setOtpDialog(true);
  };

  const handleVerifyOTP = () => {
    setOtpDialog(false);
    toast({
      title: "Verified",
      description: "Phone number verified successfully!",
    });

    // You can also put other verification logic here
  };

  const handleEmailLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #d9e9dd 0%, #bcddc4 50%, #a8cdb0 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5"></div>

      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-green-400/5"></div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center space-y-8 px-12">
            <div className="flex justify-center">
              <div className="relative group">
                <div
                  className="absolute -inset-3 rounded-full blur-lg transition-all duration-500 group-hover:blur-xl"
                  style={{
                    background: "linear-gradient(45deg, #bcddc4, #d9e9dd, #bcddc4)",
                    opacity: 0.4,
                  }}
                ></div>
                <div
                  className="relative p-4 rounded-lg border border-white/70 shadow-2xl"
                  style={{
                    background: "#ffffff",
                  }}
                >
                  <KeyarLogo width={180} height={95} className="object-contain" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h1
                  className="text-4xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #d9e9dd, #bcddc4, #a8cdb0)",
                  }}
                >
                  {companyDetails.name}
                </h1>
                <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
              </div>
              <p className="text-xl leading-relaxed text-green-100/90 max-w-md">
                Transform your billing workflow with our intelligent invoice management platform
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="text-center space-y-3 group">
                <div className="relative">
                  <div className="text-4xl font-bold text-green-100 group-hover:scale-110 transition-transform duration-300">
                    15K+
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"></div>
                </div>
                <div className="text-sm text-green-200/80">Happy Clients</div>
              </div>
              <div className="text-center space-y-3 group">
                <div className="relative">
                  <div className="text-4xl font-bold text-green-100 group-hover:scale-110 transition-transform duration-300">
                    99.9%
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full"></div>
                </div>
                <div className="text-sm text-green-200/80">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-300/10 blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400/15 to-green-300/5 blur-lg"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 relative z-20">
        <div className="w-full max-w-md">
          <div
            className="backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500"></div>

            <div className="text-center md:hidden mb-8">
              <div className="flex justify-center mb-4">
                <div
                  className="p-2 rounded-md shadow-lg"
                  style={{
                    background: "#ffffff",
                  }}
                >
                  <KeyarLogo width={110} height={65} className="object-contain" />
                </div>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#13271f" }}>
                {companyDetails.name}
              </h2>
            </div>

            {/* Login Form with Props */}
            <LoginForm
              phoneNumber={phoneNumber}
              onPhoneChange={setPhoneNumber}
              onSendOTP={handleSendOTP}
              onEmailLogin={handleEmailLogin}
            />
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <OTPDialog
        open={otpDialog}
        onOpenChange={setOtpDialog}
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOTP}
        onResend={handleSendOTP}
      />
    </div>
  );
}

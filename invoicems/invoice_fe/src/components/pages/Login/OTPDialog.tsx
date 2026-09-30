"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import { Button } from "../../ui/button";

// ✅ Import useToast
import { useToast } from "../../ui/use-toast";

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  onVerify: () => void;
  onResend: () => void;
}

export function OTPDialog({
  open,
  onOpenChange,
  phoneNumber,
  onVerify,
  onResend,
}: OTPDialogProps) {
  const [otp, setOtp] = useState("");

  const { toast } = useToast(); // ✅ initialize toast

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify();
      toast({
        title: "Verified ✅",
        description: "Phone number verified successfully!",
      });
      setOtp("");
    }
  };

  const handleResend = () => {
    setOtp("");
    onResend();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to {phoneNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <div className="flex flex-col w-full space-y-3">
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
              style={{
                background:
                  "linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)",
              }}
            >
              Verify & Sign In
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              className="w-full "
            >
              Resend Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

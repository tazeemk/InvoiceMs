import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const spinnerVariants = {
  default: "h-4 w-4",
  sm: "h-2 w-2",
  lg: "h-6 w-6",
  icon: "h-10 w-10",
};

interface SpinnerProps {
  size?: keyof typeof spinnerVariants;
  className?: string;
}

export const Spinner = ({ size, className }: SpinnerProps) => {
  const sizeClass = spinnerVariants[size || "default"];
  return (
    <Loader className={cn("animate-spin text-emerald-600", sizeClass, className)} />
  );
};
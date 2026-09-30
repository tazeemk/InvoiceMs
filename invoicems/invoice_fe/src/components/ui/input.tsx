import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg text-gray-900 placeholder-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900 selection:bg-emerald-100 selection:text-emerald-900",
        className
      )}
      {...props}
    />
  )
}

export { Input }
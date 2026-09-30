"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-12  items-center justify-center rounded-xl p-1 backdrop-blur-sm border border-white/20 shadow-lg",
        className
      )}
      style={{
        background: "rgba(188, 221, 196, 0.3)"
      }}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none  focus:rounded-xl", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
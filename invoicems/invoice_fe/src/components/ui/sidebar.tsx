"use client"

import { useState, useEffect, useContext, createContext, useCallback, useMemo } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeftIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_LG = "18rem"
const SIDEBAR_WIDTH_ICON = "4rem"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [_open, _setOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const open = openProp ?? _open
  
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [setOpenProp, open]
  )

  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView) {
        setOpen(false)
      }
    }
    
    checkMobile()
    
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    mediaQuery.addEventListener("change", checkMobile)
    return () => mediaQuery.removeEventListener("change", checkMobile)
  }, [mounted, setOpen])

  useEffect(() => {
    if (!mounted || !isMobile) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault()
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [mounted, isMobile, open, setOpen])

  useEffect(() => {
    if (!mounted || !isMobile || !open) return

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [mounted, isMobile, open])

  const state = open ? "expanded" : "collapsed"

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
      isMobile,
    }),
    [state, open, setOpen, toggleSidebar, isMobile]
  )

  if (!mounted) {
    return (
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-lg": SIDEBAR_WIDTH_LG,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-screen w-full",
          "bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30",
          className
        )}
        {...props}
      >
        <SidebarContext.Provider value={contextValue}>
          {children}
        </SidebarContext.Provider>
      </div>
    )
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-lg": SIDEBAR_WIDTH_LG,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-screen w-full",
          "bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
}) {
  const { state, open, setOpen, isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="group peer hidden md:block" data-state={state} data-side={side} data-sidebar="true">
        <div className="relative w-[--sidebar-width]" />
        <div
          className="fixed inset-y-0 z-10 hidden h-screen md:flex"
          style={{ [side]: 0, width: SIDEBAR_WIDTH }}
        >
          <div
            className={cn(
              "flex h-full w-full flex-col",
              "bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900",
              "border-r border-emerald-700/30 shadow-2xl",
              className
            )}
            data-sidebar="true"
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-out md:hidden",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          data-sidebar="true"
        >
          <div
            className={cn(
              "flex h-full w-full flex-col shadow-2xl",
              "bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900",
              "border-r border-emerald-700/30",
              className
            )}
            data-sidebar="true"
            {...props}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="group peer hidden md:block" data-state={state} data-side={side} data-sidebar="true">
      <div
        className={cn(
          "relative transition-[width] duration-300 ease-in-out",
          state === "collapsed" ? "w-16" : "w-64 lg:w-72"
        )}
      />
      <div
        className="fixed inset-y-0 z-10 hidden h-screen transition-[width] duration-300 ease-in-out md:flex"
        style={{
          [side]: 0,
          width: state === "collapsed" ? "64px" : window.innerWidth >= 1024 ? "288px" : "256px",
        }}
        data-sidebar="true"
      >
        <div
          className={cn(
            "flex h-full w-full flex-col relative",
            "bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900",
            "border-r border-emerald-700/30 shadow-2xl",
            className
          )}
          data-sidebar="true"
          {...props}
        >
          <button
            onClick={() => setOpen(!open)}
            className="absolute -right-3 top-8 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            <PanelLeftIcon className={cn("h-3 w-3 transition-transform duration-300", state === "collapsed" && "rotate-180")} />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar, isMobile } = useSidebar()

  if (!isMobile) return null

  return (
    <button
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
        "hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 md:hidden shadow-sm hover:shadow-md",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon className="h-5 w-5" />
    </button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex w-full flex-1 flex-col",
        "bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50/30",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
    style={{scrollbarWidth:"none"}}
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-xl p-3 text-left text-sm outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      size: {
        default: "h-11 text-sm",
        sm: "h-9 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  size = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { state } = useSidebar()
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ size }), className)}
      {...props}
    >
      {children}
      {state === "collapsed" && (
        <span className="sr-only">
          {typeof children === "string" ? children : "Menu item"}
        </span>
      )}
    </Comp>
  )
}

function SidebarMenuButtonText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { state } = useSidebar()
  
  return (
    <span
      className={cn(
        "transition-all duration-300 font-medium",
        state === "collapsed" && "md:opacity-0 md:w-0 md:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonText,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
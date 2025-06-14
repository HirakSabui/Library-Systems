"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, Home, Users, Plus, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Members", href: "/members", icon: Users },
]

const actions = [
  { name: "Add New Book", href: "/books/add", icon: Plus },
  { name: "Search Books", href: "/books?search=true", icon: Search },
]

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto sidebar-blue px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Library</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-blue-100 mb-2">Navigation</div>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => router.push(item.href)}
                    className={cn(
                      pathname === item.href
                        ? "bg-white/20 text-white"
                        : "text-blue-100 hover:text-white hover:bg-white/10",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-blue-100 mb-2">Actions</div>
            <ul role="list" className="-mx-2 space-y-1">
              {actions.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => router.push(item.href)}
                    className="text-blue-100 hover:text-white hover:bg-white/10 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left"
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <div className="mt-auto">
          <div className="text-xs text-blue-100 text-center py-4">KRR Library © 2025</div>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setOpen(false)}>
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

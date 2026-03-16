"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type NavItem = {
   id: string;
   label: string;
   href: string;
   icon: React.ReactNode;
   isActive?: boolean;
 };

 const navItems: NavItem[] = [
   {
     id: "jobs-queue",
     label: "Jobs Queue",
     href: "/",
     isActive: true,
     icon: (
       <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-[10px] font-semibold text-slate-700">
         JQ
       </span>
     )
   }
 ];

 const user = {
   name: "Manan Tyagi",
   initials: "MT"
 };

 export function Sidebar() {
   const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

   return (
     <aside
      className={
        "flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out h-full dark:border-slate-800 dark:bg-slate-900 " +
        (collapsed ? "w-20" : "w-48")
      }
     >
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
         <div className="flex items-center gap-3 min-w-0">
          <img
            src="/images/picarro-inc-logo-vector.svg"
            alt="Picarro"
            className="h-40 w-auto shrink-0 object-contain dark:invert"
          />
           
         </div>
       </div>

       <nav className="flex-1 px-2 py-4 space-y-1">
         {navItems.map((item) => {
           return (
             <div
               key={item.id}
              className={
                "group relative" +
                (collapsed ? " flex justify-center" : "")
              }
             >
               <Link
                href={item.href}
                className={
                  "flex w-full items-center rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800" +
                  (item.isActive
                    ? " bg-slate-50 text-slate-900 border-l-4 border-blue-500 pl-2.5 dark:bg-slate-800 dark:text-slate-50"
                    : "")
                }
              >
                {collapsed ? (
                  <div className="flex h-9 w-9 items-center justify-center">
                    {item.icon}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2">
                    {item.icon}
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                )}
              </Link>

               {collapsed && (
                 <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 transform whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                   {item.label}
                 </span>
               )}
             </div>
           );
         })}
       </nav>

       <div className="border-t border-slate-200 p-3 space-y-3 dark:border-slate-800">
        <div className="group relative">
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={
              "flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 " +
              (collapsed ? "justify-center" : "justify-start")
            }
            onClick={() => setCollapsed((prev) => !prev)}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {collapsed ? "»" : "«"}
            </span>
          </button>
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Expand sidebar
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={
            "flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 " +
            (collapsed ? "justify-center" : "justify-start gap-2")
          }
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {!collapsed && (
            <span className="font-medium">
              {isDark ? "Light mode" : "Dark mode"}
            </span>
          )}
        </button>

         <div className="group relative flex items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
             {user.initials}
           </div>
           {!collapsed && (
             <div className="flex flex-col">
               <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                 {user.name}
               </span>
               <span className="text-xs text-slate-500 dark:text-slate-400">
                 Logged in
               </span>
             </div>
           )}

           <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 w-32 rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg ring-1 ring-slate-200 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
             Logout
           </div>
         </div>
       </div>
     </aside>
   );
 }


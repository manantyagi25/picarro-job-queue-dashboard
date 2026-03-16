 "use client";

import { useState } from "react";
import Link from "next/link";

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

   return (
     <aside
      className={
        "flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out h-100vh " +
        (collapsed ? "w-20" : "w-64")
      }
     >
       <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
         <div className="flex items-center gap-3">
           <div className="h-9 w-9 rounded-md bg-slate-200" />
           {!collapsed && (
             <div className="flex flex-col">
               <span className="text-sm font-semibold text-slate-900">
                 Client Logo
               </span>
               <span className="text-xs text-slate-500">
                 Placeholder
               </span>
             </div>
           )}
         </div>
         <button
           type="button"
           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
           className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
           onClick={() => setCollapsed((prev) => !prev)}
         >
           <span className="text-xs font-medium">
             {collapsed ? "»" : "«"}
           </span>
         </button>
       </div>

       <nav className="flex-1 px-2 py-4 space-y-1">
         {navItems.map((item) => {
           const content = (
             <div className="flex items-center gap-3">
               {item.icon}
               {!collapsed && (
                 <span className="text-sm font-medium">
                   {item.label}
                 </span>
               )}
             </div>
           );

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
                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" +
                  (item.isActive
                    ? " bg-slate-50 text-slate-900 border-l-4 border-blue-500 pl-2.5"
                    : "")
                }
               >
                 {content}
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

       <div className="border-t border-slate-200 p-3">
         <div className="group relative flex items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50 cursor-pointer">
           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
             {user.initials}
           </div>
           {!collapsed && (
             <div className="flex flex-col">
               <span className="text-sm font-medium text-slate-900">
                 {user.name}
               </span>
               <span className="text-xs text-slate-500">
                 Logged in
               </span>
             </div>
           )}

           <div className="pointer-events-none absolute top-2 right-2 z-20 mt-2 w-28 rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg ring-1 ring-slate-200 opacity-0 transition-opacity group-hover:opacity-100">
             Logout
           </div>
         </div>
       </div>
     </aside>
   );
 }


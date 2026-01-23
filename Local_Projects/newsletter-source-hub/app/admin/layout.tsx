'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileEdit, Settings, ExternalLink, Menu, Lock, BookOpen, FileText, User, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSession, signOut } from "next-auth/react";
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">Initializing Command Deck...</div>;
  }

  if (status === "unauthenticated") {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen flex">
      {/* Floating Dock Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed inset-y-4 left-4 z-50 w-64 glass-panel rounded-2xl hidden md:flex flex-col overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">Hub Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard />} label="Dashboard" active={pathname === '/admin'} />
          <NavItem href="/admin/curate" icon={<BookOpen />} label="Curate Feed" active={pathname === '/admin/curate'} />
          <NavItem href="/admin/draft" icon={<FileText />} label="Generator" active={pathname === '/admin/draft'} />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2 bg-black/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-white/5 border border-white/5">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                {session?.user?.name?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all px-3 py-2 rounded-lg"
          >
            <Lock className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 p-4 md:p-6 min-h-screen">
        <header className="h-16 mb-6 glass-panel rounded-2xl flex items-center px-6 sticky top-4 z-40 justify-between shadow-sm">
           <div className="md:hidden">
             <Menu className="w-6 h-6 text-muted-foreground" />
           </div>
           
           <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/80 bg-secondary/50 px-3 py-1 rounded-full border border-white/5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             SYSTEM_OPERATIONAL
           </div>
        </header>

        <motion.main 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-indigo-500/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: cn("w-4 h-4 transition-transform duration-300", active ? "scale-100" : "group-hover:scale-110")
      })}
      <span className="relative z-10">{label}</span>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      )}
    </Link>
  );
}

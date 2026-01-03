'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Menu, X } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="glass-card mx-4 mt-4 rounded-2xl border border-white/10">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">MedInsight</span>
                                <span className="text-xs text-indigo-400 block -mt-1">AI Analysis</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="#features">Features</NavLink>
                            <NavLink href="#how-it-works">How It Works</NavLink>
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden md:block">
                            <Link
                                href="/dashboard"
                                className="gradient-btn text-sm py-2.5 px-5"
                            >
                                Analyze Report
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10"
                    >
                        <div className="container-custom py-4 flex flex-col gap-4">
                            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                Dashboard
                            </MobileNavLink>
                            <MobileNavLink href="#features" onClick={() => setIsMenuOpen(false)}>
                                Features
                            </MobileNavLink>
                            <MobileNavLink href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
                                How It Works
                            </MobileNavLink>
                            <Link
                                href="/dashboard"
                                className="gradient-btn text-center text-sm py-2.5 mt-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Analyze Report
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm text-zinc-400 hover:text-white transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
        </Link>
    );
}

function MobileNavLink({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            className="text-zinc-300 hover:text-white transition-colors py-2"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}

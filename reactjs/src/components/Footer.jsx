import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { navLinks } from "../data/navLinks";
import Logo from "./Logo";

export default function Footer() {
    const { theme } = useThemeContext();
    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full dark:text-slate-50">
            <div className="absolute right-0 md:right-16 lg:right-24 xl:right-32 top-0 pointer-events-none -mt-20 max-md:px-4 text-[4rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-bold text-slate-100 dark:text-slate-800/50 uppercase tracking-tighter select-none z-0">
                TriGen AI
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 dark:border-slate-700 pb-6 relative z-10">
                <div className="md:max-w-114">
                    <a href="https://prebuiltui.com?utm_source=trigen-ai">
                        <Logo />
                    </a>
                    <p className="mt-6">
                        Turn your imagination into stunning videos, images, and voice instantly, from a single idea.This highlights both simplicity and capability.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="space-y-2">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-purple-600 transition">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="space-y-2">
                            <p>9960424134</p>
                            <p>Trigen@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                Copyright 2026 © <a href="https://prebuiltui.com?utm_source=landing">TriGen AI</a>. All Right Reserved.
            </p>
        </footer>
    );
};
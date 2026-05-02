"use client"
import { VideoIcon, ImageIcon, MicIcon } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { companiesLogo } from "../data/companiesLogo";
import { featuresData } from "../data/featuresData";
import SectionTitle from "../components/SectionTitle";
import { useThemeContext } from "../context/ThemeContext";
import { FaqSection } from "../sections/FaqSection";
import Pricing from "../sections/Pricing";
import { SignedOut, SignedIn } from "@clerk/clerk-react";

export default function Page() {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-col items-center justify-center text-center px-4 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
                <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-46 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
                    <div className="flex items-center -space-x-3">
                        <img className="size-7 rounded-full" height={50} width={50}
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                            alt="userImage1" />
                        <img className="size-7 rounded-full" height={50} width={50}
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                            alt="userImage2" />
                        <img className="size-7 rounded-full" height={50} width={50}
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                            alt="userImage3" />
                    </div>
                    <p className="text-xs">Join our SaaS community </p>
                </div>
                <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-2xl">
                    Start generating with{" "}
                    <span className="bg-gradient-to-r from-[#923FEF] dark:from-[#C99DFF] to-[#C35DE8] dark:to-[#E1C9FF] bg-clip-text text-transparent">Us</span>
                </h1>
                <p className="text-base dark:text-slate-300 max-w-lg mt-2">
                    Our latest thoughts, trends, and tools, written to help you learn, build, and grow faster.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    <SignedOut>
                        <button onClick={() => navigate("/sign-up")} className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
                            Get started
                        </button>
                    </SignedOut>
                    <SignedIn>
                        <button onClick={() => navigate("/dashboard")} className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
                            Go to Dashboard
                        </button>
                        <button onClick={() => navigate("/generate-video")} className="flex items-center gap-2 border border-purple-900 transition text-slate-600 dark:text-white rounded-md px-6 h-11 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                            <VideoIcon strokeWidth={1} />
                            <span>Generate video</span>
                        </button>
                        <button onClick={() => navigate("/create-image")} className="flex items-center gap-2 border border-purple-900 transition text-slate-600 dark:text-white rounded-md px-6 h-11 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                            <ImageIcon strokeWidth={1} />
                            <span>Generate image</span>
                        </button>
                        <button onClick={() => navigate("/generate-speech")} className="flex items-center gap-2 border border-purple-900 transition text-slate-600 dark:text-white rounded-md px-6 h-11 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                            <MicIcon strokeWidth={1} />
                            <span>Generate speech</span>
                        </button>
                    </SignedIn>
                </div>
                <h3 className="text-base text-center text-slate-400 mt-28 pb-14 font-medium">
                    Upload generated images and videos on social media like —
                </h3>
                <Marquee className="max-w-5xl mx-auto" gradient={true} speed={25} gradientColor={theme === "dark" ? "#000" : "#fff"}>
                    <div className="flex items-center justify-center">
                        {[...companiesLogo, ...companiesLogo].map((company, index) => (
                            <img key={index} className="mx-12 h-12 w-12 object-contain grayscale hover:grayscale-0 transition duration-300" src={company.logo} alt={company.name} width={48} height={48} />
                        ))}
                    </div>
                </Marquee>
            </div>

            <SectionTitle text1="FEATURES" text2="Built for builders" text3="Components, patterns and pages — everything you need to ship." />

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
                {featuresData.map((feature, index) => (
                    <div key={index} className="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66">
                        <feature.icon className="text-purple-500 size-8 mt-4" strokeWidth={1.3} />
                        <h3 className="text-base font-medium">{feature.title}</h3>
                        <p className="text-slate-400 line-clamp-2">{feature.description}</p>
                    </div>
                ))}
            </div>

            <Pricing />

            <FaqSection />

            <div className="flex flex-col items-center text-center justify-center mt-20">
                <h3 className="text-3xl font-semibold mt-16 mb-4">Ready to Get Started?</h3>
                <p className="text-slate-600 dark:text-slate-200 max-w-xl mx-auto">
                    Join thousands of satisfied customers and transform your business today.
                </p>
                <div className="flex items-center gap-4 mt-8">
                    <button onClick={() => navigate("/sign-up")} className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
                        Start free trial
                    </button>
                </div>
            </div>

            <div className="fixed bottom-4 left-4 text-[10px] text-slate-500 opacity-30">v2.0-EDGE</div>
        </>
    );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, VideoIcon, MicIcon, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export default function FeaturesPage() {
    const navigate = useNavigate();

    const features = [
        {
            title: "Image Generation",
            description: "Create stunning, high-quality images from text prompts using advanced AI models.",
            icon: <ImageIcon size={40} className="text-purple-400" />,
            path: "/generate-image",
            color: "from-purple-500/20 to-purple-600/5",
            borderColor: "border-purple-500/30"
        },
        {
            title: "Video Generation",
            description: "Bring your ideas to life with dynamic AI video generation. High resolution and smooth animations.",
            icon: <VideoIcon size={40} className="text-blue-400" />,
            path: "/generate-video",
            color: "from-blue-500/20 to-blue-600/5",
            borderColor: "border-blue-500/30"
        },
        {
            title: "Speech Generation",
            description: "Convert text into lifelike audio with multiple voices and accents for your projects.",
            icon: <MicIcon size={40} className="text-emerald-400" />,
            path: "/generate-speech",
            color: "from-emerald-500/20 to-emerald-600/5",
            borderColor: "border-emerald-500/30"
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[#030014] bg-no-repeat bg-cover flex flex-col items-center">
            
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
                    <span className="text-purple-400 font-semibold tracking-wide uppercase text-xs">Features</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Our AI Creation Suite</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Explore all the powerful AI generation tools available at your fingertips.
                </p>
            </div>
            
            <SignedIn>
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            onClick={() => navigate(feature.path)}
                            className={`cursor-pointer group bg-gradient-to-br ${feature.color} bg-[#111322] border ${feature.borderColor} rounded-3xl p-8 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-purple-500/20 flex flex-col items-start`}
                        >
                            <div className="bg-[#0f111f] p-4 rounded-2xl mb-6 shadow-inner border border-slate-800">
                                {feature.icon}
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                {feature.title}
                            </h2>
                            
                            <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                                {feature.description}
                            </p>
                            
                            <div className="mt-auto w-full flex items-center justify-between text-sm font-bold text-slate-300 group-hover:text-purple-400 transition-colors">
                                <span>Try Now</span>
                                <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </SignedIn>

            <SignedOut>
                <div className="w-full max-w-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-10 border border-slate-200 dark:border-slate-800 text-center shadow-xl flex flex-col items-center">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                        <ImageIcon size={40} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Sign in to access our generation tools</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                        Our powerful AI Image, Video, and Speech generation tools are exclusively available for our members. 
                    </p>
                    <button 
                        onClick={() => navigate('/sign-up')} 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95"
                    >
                        Create an Account
                    </button>
                    <button 
                        onClick={() => navigate('/sign-in')} 
                        className="mt-4 text-slate-500 hover:text-purple-600 text-sm font-medium transition-colors"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </SignedOut>

        </div>
    );
}

import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ImageIcon, VideoIcon, Plus, MicIcon } from "lucide-react";

export default function Dashboard() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <div className="pt-32 text-center text-xl">Loading...</div>;
    }

    if (!isSignedIn) {
        return <div className="pt-32 text-center text-xl text-red-500">Please sign in to view this page.</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[#030014] bg-no-repeat bg-cover">
            <div className="w-full max-w-5xl">
                <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Welcome, {user.firstName}!</h1>
                
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md mb-12 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4 text-left">
                        <div className="scale-125 origin-left">
                            <UserButton />
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-slate-900 dark:text-white">{user.fullName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Your Libraries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Image Library Card */}
                    <Link to="/image-library" className="group block p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110">
                                <ImageIcon size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Image Library</h3>
                        <p className="text-slate-500 dark:text-slate-400">View and download all your AI-generated images.</p>
                    </Link>

                    {/* Video Library Card */}
                    <Link to="/video-library" className="group block p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                                <VideoIcon size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Video Library</h3>
                        <p className="text-slate-500 dark:text-slate-400">View and download all your AI-generated videos.</p>
                    </Link>

                    {/* Speech Library Card */}
                    <Link to="/speech-library" className="group block p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-2xl text-pink-600 dark:text-pink-400 transition-transform group-hover:scale-110">
                                <MicIcon size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Speech Library</h3>
                        <p className="text-slate-500 dark:text-slate-400">Listen to and download your AI-generated voiceovers.</p>
                    </Link>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Create New</h2>
                <div className="flex flex-wrap gap-4">
                    <Link to="/generate-image" className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition shadow-lg shadow-purple-500/20">
                        <Plus size={20} /> New Image
                    </Link>
                    <Link to="/generate-video" className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-medium transition shadow-lg">
                        <Plus size={20} /> New Video
                    </Link>
                    <Link to="/generate-speech" className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium transition shadow-lg border border-slate-200 dark:border-slate-700">
                        <Plus size={20} /> New Speech
                    </Link>
                </div>

            </div>
        </div>
    );
}

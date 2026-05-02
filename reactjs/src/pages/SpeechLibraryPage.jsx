import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MicIcon, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';

export default function SpeechLibraryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [speeches, setSpeeches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Single view mode
    const { url: singleUrl, prompt: singlePrompt, title: singleTitle } = location.state || {};
    const isSingleView = !!singleUrl;

    useEffect(() => {
        if (!isLoaded || isSingleView) {
            if (isSingleView) setIsLoading(false);
            return;
        }
        
        async function fetchSpeeches() {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('user_generations')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('type', 'speech')
                    .not('url', 'is', null)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setSpeeches(data || []);
            } catch (err) {
                console.error("Failed to fetch speeches:", err);
                setFetchError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchSpeeches();
    }, [isLoaded, user, isSingleView]);

    const handleBack = () => {
        if (isSingleView) {
            navigate('/generate-speech');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[#030014] bg-no-repeat bg-cover flex flex-col items-center">
            <div className="w-full max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={handleBack} 
                        className="text-slate-500 hover:text-purple-600 transition flex items-center gap-2 text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-800 px-4 py-2 rounded-xl"
                    >
                        <ArrowLeft size={16} /> {isSingleView ? "Back to Creator" : "Back to Dashboard"}
                    </button>
                    
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <MicIcon className="text-pink-500" /> {isSingleView ? "Generated Speech" : "My Speech Library"}
                    </h1>
                </div>

                <div className="bg-white/70 dark:bg-[#111322]/80 backdrop-blur-xl border border-slate-200 dark:border-[#23253a] rounded-3xl p-8 shadow-2xl min-h-[500px]">
                    {isSingleView ? (
                        // SINGLE VIEW MODE
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative group bg-slate-100 dark:bg-[#0b0c16] flex items-center justify-center min-h-[400px] p-8">
                                    
                                    <div className="w-full max-w-xl mx-auto space-y-8 text-center flex flex-col items-center">
                                        <div className="p-6 bg-pink-500/20 rounded-full animate-pulse">
                                            <MicIcon size={64} className="text-pink-500" />
                                        </div>
                                        <audio 
                                            src={singleUrl} 
                                            controls
                                            autoPlay
                                            className="w-full outline-none"
                                        ></audio>
                                    </div>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <a 
                                            href={singleUrl} 
                                            download={`VidMaxx_Speech_${Date.now()}.wav`}
                                            target="_blank" rel="noreferrer"
                                            className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition text-sm"
                                        >
                                            <Download size={16} /> Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">Title</h3>
                                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">{singleTitle || "Untitled Speech"}</p>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">Spoken Text</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-pink-500 pl-4 max-h-60 overflow-y-auto pr-2">{singlePrompt}</p>
                                </div>

                                <button onClick={() => navigate('/speech-library')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition">
                                    View Full Library
                                </button>
                            </div>
                        </div>
                    ) : (
                        // MULTI VIEW MODE (LIBRARY)
                        <>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="animate-spin text-pink-600 mb-4" size={40} />
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your speeches...</p>
                                </div>
                            ) : fetchError ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-red-500">
                                    <h2 className="text-2xl font-semibold mb-2">Error Loading Speeches</h2>
                                    <p className="max-w-md mb-6">{fetchError}</p>
                                </div>
                            ) : speeches.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                    <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
                                        <MicIcon size={40} className="text-pink-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-white">No speeches found!</h2>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                                        Your library is currently empty. Head over to the creator to generate your first voiceover!
                                    </p>
                                    <button 
                                        onClick={() => navigate('/generate-speech')} 
                                        className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-lg"
                                    >
                                        <Sparkles size={18} /> Generate Speech
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {speeches.map((speech) => (
                                        <div key={speech.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col p-6">
                                            
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-500">
                                                        <MicIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{speech.title || "Untitled"}</h3>
                                                        <div className="text-xs text-slate-400 font-medium">
                                                            {new Date(speech.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <a 
                                                    href={speech.url} 
                                                    download={`VidMaxx_Speech_${speech.id}.wav`}
                                                    target="_blank" rel="noreferrer"
                                                    className="text-slate-400 hover:text-pink-500 transition p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                                                    title="Download Audio"
                                                >
                                                    <Download size={20} />
                                                </a>
                                            </div>

                                            <div className="mb-6 p-4 bg-white dark:bg-[#0b0c16] rounded-xl border border-slate-100 dark:border-slate-800">
                                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 italic">
                                                    "{speech.prompt}"
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#23253a]">
                                                <audio 
                                                    src={speech.url} 
                                                    controls
                                                    className="w-full h-10 outline-none"
                                                    preload="metadata"
                                                ></audio>
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

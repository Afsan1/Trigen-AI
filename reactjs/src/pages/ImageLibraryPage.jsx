import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageIcon, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';

export default function ImageLibraryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // If we passed state from GenerateImagePage, we are in "Single View" mode
    const { url: singleUrl, prompt: singlePrompt, title: singleTitle } = location.state || {};
    const isSingleView = !!singleUrl;

    useEffect(() => {
        if (!isLoaded || isSingleView) {
            if (isSingleView) setIsLoading(false);
            return;
        }
        
        async function fetchImages() {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('user_generations')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('type', 'image')
                    .not('url', 'is', null) // Filter out old failed ones
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setImages(data || []);
            } catch (err) {
                console.error("Failed to fetch images:", err);
                setFetchError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchImages();
    }, [isLoaded, user, isSingleView]);

    const handleBack = () => {
        if (isSingleView) {
            navigate('/generate-image');
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
                        <ImageIcon className="text-purple-500" /> {isSingleView ? "Generated Image" : "My Image Library"}
                    </h1>
                </div>

                <div className="bg-white/70 dark:bg-[#111322]/80 backdrop-blur-xl border border-slate-200 dark:border-[#23253a] rounded-3xl p-8 shadow-2xl min-h-[500px]">
                    
                    {isSingleView ? (
                        // SINGLE VIEW MODE
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative group bg-slate-100 dark:bg-black flex items-center justify-center min-h-[400px]">
                                    <img 
                                        src={singleUrl} 
                                        alt={singleTitle || "AI Generated Image"} 
                                        className="w-full h-auto object-cover"
                                    />
                                    
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <a 
                                            href={singleUrl} 
                                            download={`VidMaxx_Generation_${Date.now()}.png`}
                                            target="_blank" rel="noreferrer"
                                            className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition shadow-xl"
                                        >
                                            <Download size={20} /> Download Masterpiece
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">Title</h3>
                                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">{singleTitle || "Untitled Creation"}</p>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-2">Prompt Setup</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-purple-500 pl-4">{singlePrompt}</p>
                                </div>

                                <button onClick={() => navigate('/image-library')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition">
                                    View Full Library
                                </button>
                            </div>
                        </div>
                    ) : (
                        // MULTI VIEW MODE (LIBRARY)
                        <>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your masterpieces...</p>
                                </div>
                            ) : fetchError ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-red-500">
                                    <h2 className="text-2xl font-semibold mb-2">Error Loading Images</h2>
                                    <p className="max-w-md mb-6">{fetchError}</p>
                                </div>
                            ) : images.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                                        <ImageIcon size={40} className="text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-white">No images found!</h2>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                                        Your library is currently empty. Head over to the creator to generate your first masterpiece!
                                    </p>
                                    <button 
                                        onClick={() => navigate('/generate-image')} 
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
                                    >
                                        <Sparkles size={18} /> Generate Artwork
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {images.map((img) => (
                                        <div key={img.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                                            <div className="relative aspect-square overflow-hidden bg-slate-200 dark:bg-black">
                                                <img 
                                                    src={img.url} 
                                                    alt={img.title || "AI Generated"} 
                                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/600x600/111322/purple?text=Image+Unavailable'; }}
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center backdrop-blur-sm">
                                                    <a 
                                                        href={img.url} 
                                                        download={`VidMaxx_${img.id}.png`}
                                                        target="_blank" rel="noreferrer"
                                                        className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition shadow-xl"
                                                    >
                                                        <Download size={18} /> Download
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">{img.title || "Untitled"}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                                                    {img.prompt}
                                                </p>
                                                <div className="text-xs text-slate-400 font-medium">
                                                    {new Date(img.created_at).toLocaleDateString()}
                                                </div>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoIcon, Sparkles } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';


export default function GenerateVideoPage() {
    const { theme } = useThemeContext();
    const { user } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("You must be signed in to generate a video.");
            return;
        }

        setIsLoading(true);

        const title = e.target.title.value;
        const prompt = e.target.prompt.value;
        const description = e.target.description.value;

        let dbId = null;

        try {
            const { data, error: dbError } = await supabase
                .from('user_generations')
                .insert([
                    {
                        user_id: user.id,
                        type: 'video',
                        title,
                        prompt,
                        description
                    }
                ])
                .select()
                .single();

            if (dbError) {
                console.error("Supabase Error:", dbError);
                throw new Error(`Database Error: ${dbError.message}`);
            }
            
            dbId = data.id;
        } catch (error) {
            setIsLoading(false);
            return alert(`Failed to save to database: ${error.message}\n\nPlease verify your Supabase keys and ensure the 'user_generations' table exists.`);
        }

        try {
            // Get Magic Hour API Key
            const MH_KEY = import.meta.env.VITE_MAGIC_HOUR_KEY;
            if (!MH_KEY) {
                throw new Error("Missing Magic Hour API Key! Please add VITE_MAGIC_HOUR_KEY to your .env file and restart the server.");
            }

            // 1. Initiate the Job
            const initResponse = await fetch(
                "https://api.magichour.ai/v1/text-to-video",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${MH_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                        style: { prompt: prompt },
                        end_seconds: 5,
                        aspect_ratio: "16:9"
                    }),
                }
            );

            if (!initResponse.ok) {
                const text = await initResponse.text();
                throw new Error(`Magic Hour Init Error: ${initResponse.statusText} - ${text}`);
            }

            const initData = await initResponse.json();
            const jobId = initData.id;

            if (!jobId) {
                throw new Error("Failed to receive Job ID from Magic Hour.");
            }

            // 2. Poll the Status endpoint every 5 seconds
            let objectUrl = null;
            let isDone = false;

            while (!isDone) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const pollResponse = await fetch(
                    `https://api.magichour.ai/v1/video-projects/${jobId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${MH_KEY}`,
                        }
                    }
                );

                if (!pollResponse.ok) continue;

                const pollData = await pollResponse.json();
                
                // Magic Hour status checks
                if (pollData.status === "failed" || pollData.status === "error" || pollData.error) {
                    throw new Error(`Generation failed: ${pollData.error || "Unknown Error"}`);
                }

                if (pollData.status === "complete" || pollData.status === "success" || pollData.status === "done") {
                    isDone = true;
                    // Extract Video URL
                    // Searching common paths since we just want the output payload
                    const urlOutput = 
                        pollData?.download?.url || 
                        pollData?.downloads?.[0]?.url || 
                        pollData?.video_url || 
                        pollData?.output?.url ||
                        pollData?.result?.url ||
                        pollData?.outputs?.[0]?.url;

                    if (urlOutput) {
                        objectUrl = urlOutput;
                    } else {
                        console.error("Unknown Magic Hour Response Structure:", pollData);
                        throw new Error("Video marked complete but format was unrecognized (Check console logs).");
                    }
                }
            }
            
            if (objectUrl && dbId) {
                const { error: updateError } = await supabase
                    .from('user_generations')
                    .update({ url: objectUrl })
                    .eq('id', dbId);
                
                if (updateError) {
                    console.error("Failed to update db with URL:", updateError);
                }
            }

            navigate('/video-library', { 
                state: { 
                    url: objectUrl, 
                    prompt: prompt,
                    title: title 
                } 
            });

        } catch (error) {
            console.error("Error generating video:", error);
            alert(`Video Generation Failed: ${error.message}\n\nPlease check your Magic Hour API key and billing / free limits.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[#030014] bg-no-repeat bg-cover flex flex-col items-center">
            
            <div className="w-full max-w-3xl">
                <button 
                    onClick={() => navigate('/')} 
                    className="text-slate-500 hover:text-purple-600 transition mb-8 flex items-center gap-2 text-sm font-medium"
                >
                    &larr; Back to Home
                </button>

                <div className="bg-white/70 dark:bg-[#111322]/80 backdrop-blur-xl border border-slate-200 dark:border-[#23253a] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <VideoIcon className="text-purple-600 dark:text-purple-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Video</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Transform your ideas into engaging videos using AI.</p>
                        </div>
                    </div>

                    <hr className="my-8 border-slate-200 dark:border-[#2d3148]" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Video Title
                            </label>
                            <input 
                                type="text" 
                                id="title" 
                                required
                                placeholder="E.g., Product Launch Teaser" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0b0c16] border border-slate-200 dark:border-[#2d3148] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* User Prompt Section */}
                        <div className="space-y-2">
                            <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                User Prompt <span className="text-purple-600 dark:text-purple-400">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Describe exactly what you want to see in the video.</p>
                            <textarea 
                                id="prompt" 
                                rows="4"
                                required
                                placeholder="A cinematic showcase of a sleek new sports car drifting through neon-lit futuristic city streets..." 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0b0c16] border border-slate-200 dark:border-[#2d3148] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-slate-900 dark:text-white resize-none"
                            ></textarea>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Description <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <textarea 
                                id="description" 
                                rows="3"
                                placeholder="Any additional context, voiceover instructions, or text captions to include." 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0b0c16] border border-slate-200 dark:border-[#2d3148] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-slate-900 dark:text-white resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition active:scale-[0.98] shadow-lg shadow-purple-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin size-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                        <span>Generating with Magic Hour (May take a few mins)...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Generate Video</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

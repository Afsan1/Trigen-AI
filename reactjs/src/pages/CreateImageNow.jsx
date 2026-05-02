import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Sparkles } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';


export default function GenerateImagePage() {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("You must be signed in to generate an image.");
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
                        type: 'image',
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
            // Make HF API Call
            const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_KEY;
            if (!HF_TOKEN) {
                throw new Error("Missing API Key! Please stop your server and run 'npm run dev' again so Vite can load your new .env variables.");
            }

            console.log("Generating image via final-fix proxy...");
            const response = await fetch(
                `/api/final-fix?t=${Date.now()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ prompt }),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Model Error: ${response.statusText} - ${text}`);
            }

            const blob = await response.blob();
            
            // Upload to Supabase Storage
            const fileName = `${user.id}_${Date.now()}.png`;
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('user_assets')
                .upload(fileName, blob, {
                    contentType: 'image/png'
                });

            if (uploadError) {
                console.error("Storage upload error:", uploadError);
                throw new Error(`Storage Error: ${uploadError.message}`);
            }

            // Get public URL
            const { data: publicUrlData } = supabase
                .storage
                .from('user_assets')
                .getPublicUrl(fileName);
                
            const objectUrl = publicUrlData.publicUrl;

            if (objectUrl && dbId) {
                const { error: updateError } = await supabase
                    .from('user_generations')
                    .update({ url: objectUrl })
                    .eq('id', dbId);
                
                if (updateError) {
                    console.error("Failed to update db with URL:", updateError);
                }
            }
            
            // Navigate to the library with the image state
            navigate('/image-library', { 
                state: { 
                    url: objectUrl, 
                    prompt: prompt,
                    title: title 
                } 
            });

        } catch (error) {
            console.error("Error generating image:", error);
            alert(`Image Generation Failed: ${error.message}\n\nEnsure your HuggingFace token is correct and models are active.`);
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
                            <ImageIcon className="text-purple-600 dark:text-purple-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white border-2 border-purple-500 p-2 rounded-lg">Create Image (LATEST)</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Transform your ideas into stunning images using AI.</p>
                        </div>
                    </div>

                    <hr className="my-8 border-slate-200 dark:border-[#2d3148]" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Image Title
                            </label>
                            <input 
                                type="text" 
                                id="title" 
                                required
                                placeholder="E.g., Cyberpunk Cityscape" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0b0c16] border border-slate-200 dark:border-[#2d3148] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* User Prompt Section */}
                        <div className="space-y-2">
                            <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                User Prompt <span className="text-purple-600 dark:text-purple-400">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Describe exactly what you want to see in the image.</p>
                            <textarea 
                                id="prompt" 
                                rows="4"
                                required
                                placeholder="A hyper-realistic concept art of a futuristic neon city under heavy rain..." 
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
                                placeholder="Any additional context, styles (e.g. digital art, oil painting), or aspect ratios." 
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
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Generate Image</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="fixed bottom-4 right-4 text-[10px] text-slate-500 opacity-30">v2.0-EDGE</div>
        </div>
    );
}

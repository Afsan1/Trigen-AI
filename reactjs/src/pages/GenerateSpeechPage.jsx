import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MicIcon, Sparkles } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';

export default function GenerateSpeechPage() {
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be signed in to generate speech.");
            return;
        }

        setIsLoading(true);

        const language = e.target.language.value;
        const textToTransform = e.target.textToTransform.value;

        let dbId = null;

        try {
            const { data, error: dbError } = await supabase
                .from('user_generations')
                .insert([
                    {
                        user_id: user.id,
                        type: 'speech',
                        title: `Audio: ${language.toUpperCase()}`,
                        prompt: textToTransform,
                        description: language
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
            return alert(`Failed to save to database: ${error.message}\n\nPlease check if you ran the SQL patch to allow 'speech' types!`);
        }

        try {
            const langCode = language === 'hindi' ? 'hi' : 'en';
            
            // Using a massively distributed open-source translation API natively (Bypasses Google Proxy blocks and HuggingFace Token failures)
            const response = await fetch(
                `https://lingva.ml/api/v1/audio/${langCode}/${encodeURIComponent(textToTransform)}`
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Generation Server Error: ${response.statusText} - ${text}`);
            }

            // Raw byte array buffer returned natively, convert directly to MP3 Blob
            const data = await response.json();
            const audioBytes = new Uint8Array(data.audio);
            const blob = new Blob([audioBytes], { type: 'audio/mp3' });
            
            const fileName = `${user.id}_speech_${Date.now()}.mp3`;
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('user_assets')
                .upload(fileName, blob, {
                    contentType: 'audio/mp3'
                });

            if (uploadError) {
                throw new Error(`Storage Error: ${uploadError.message}`);
            }

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
                
                if(updateError) console.error(updateError);
            }
            
            navigate('/speech-library', { 
                state: { 
                    url: objectUrl, 
                    prompt: textToTransform,
                    title: `Audio: ${language.toUpperCase()}`
                } 
            });

        } catch (error) {
            console.error("Error generating speech:", error);
            alert(`Speech Generation Failed: ${error.message}`);
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
                            <MicIcon className="text-purple-600 dark:text-purple-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Generate Speech</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Transform your text into realistic, studio-quality voiceovers.</p>
                        </div>
                    </div>

                    <hr className="my-8 border-slate-200 dark:border-[#2d3148]" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Language Selection */}
                        <div className="space-y-2">
                            <label htmlFor="language" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Select Language <span className="text-purple-600 dark:text-purple-400">*</span>
                            </label>
                            <div className="relative">
                                <select 
                                    id="language" 
                                    required
                                    defaultValue="english"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0b0c16] border border-slate-200 dark:border-[#2d3148] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-slate-900 dark:text-white appearance-none"
                                >
                                    <option value="english">English (US)</option>
                                    <option value="hindi">Hindi (IN)</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Text Input Section */}
                        <div className="space-y-2">
                            <label htmlFor="textToTransform" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Text to Transform <span className="text-purple-600 dark:text-purple-400">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Write or paste the text you want the AI to read naturally.</p>
                            <textarea 
                                id="textToTransform" 
                                rows="6"
                                required
                                placeholder="Hello! Welcome to our new AI-powered platform..." 
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
                                        <span>Generating Audio...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Generate Speech</span>
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

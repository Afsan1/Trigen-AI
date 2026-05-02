import React from 'react';
import { PricingTable } from "@clerk/clerk-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[#030014] bg-no-repeat bg-cover flex flex-col items-center">
            
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6">
                    <span className="text-purple-400 font-semibold tracking-wide uppercase text-xs">Pricing</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Our Pricing Plans</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Flexible pricing options designed to meet your needs — straight to checkout.
                </p>
            </div>
            
            <div className="w-full flex justify-center custom-clerk-pricing">
                <PricingTable 
                    appearance={{
                        variables: {
                            colorPrimary: '#9333ea', // purple-600
                            colorBackground: '#111322', // dark background for cards
                            colorText: '#ffffff',
                            colorTextSecondary: '#94a3b8',
                            colorAlphaShade: 'rgba(147, 51, 234, 0.1)',
                            borderRadius: '1rem',
                        },
                        elements: {
                            rootBox: "w-full flex justify-center",
                            card: "bg-[#111322] border border-[#23253a] shadow-2xl transition hover:shadow-purple-500/20",
                            button: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-transform active:scale-95",
                            badge: "bg-white text-purple-600 font-bold",
                            pricingTablePrice: "text-white",
                            pricingTablePeriod: "text-slate-400",
                            pricingTableFeature: "text-slate-300",
                        }
                    }}
                />
            </div>

        </div>
    );
}

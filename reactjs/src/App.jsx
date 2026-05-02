import { Routes, Route } from "react-router-dom"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import Dashboard from "./pages/Dashboard"
import PricingPage from "./pages/PricingPage"
import FeaturesPage from "./pages/FeaturesPage"
import BillingPage from "./pages/BillingPage"
import GenerateVideoPage from "./pages/GenerateVideoPage"
import GenerateImagePage from "./pages/CreateImageNow"
import GenerateSpeechPage from "./pages/GenerateSpeechPage"
import ImageLibraryPage from "./pages/ImageLibraryPage"
import VideoLibraryPage from "./pages/VideoLibraryPage"
import SpeechLibraryPage from "./pages/SpeechLibraryPage"



export default function App() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/billing" element={<BillingPage />} />

                    <Route path="/generate-video" element={
                        <>
                            <SignedIn><GenerateVideoPage /></SignedIn>
                            <SignedOut><RedirectToSignIn /></SignedOut>
                        </>
                    } />
                    <Route path="/create-image" element={
                        <>
                            <SignedIn><GenerateImagePage /></SignedIn>
                            <SignedOut><RedirectToSignIn /></SignedOut>
                        </>
                    } />
                    <Route path="/generate-speech" element={
                        <>
                            <SignedIn><GenerateSpeechPage /></SignedIn>
                            <SignedOut><RedirectToSignIn /></SignedOut>
                        </>
                    } />

                    <Route path="/image-library" element={<ImageLibraryPage />} />
                    <Route path="/video-library" element={<VideoLibraryPage />} />
                    <Route path="/speech-library" element={<SpeechLibraryPage />} />

                </Routes>
            </main>
            <Footer />
        </div>
    );
}
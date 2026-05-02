import { CheckIcon } from "lucide-react";

export const pricingData = [
    {
        title: "Free",
        price: 0,
        features: [
            { name: "5 generation a day", icon: CheckIcon },
            { name: "No watermark", icon: CheckIcon },
            { name: "Basic support", icon: CheckIcon },
            { name: "Slow generation", icon: CheckIcon },
            { name: "Free plan", icon: CheckIcon },
        ],
        buttonText: "Subscribe",
    },
    {
        title: "Pro Plan",
        price: 10,
        mostPopular: true,
        features: [
            { name: "50 generation a day", icon: CheckIcon },
            { name: "Priority support", icon: CheckIcon },
            { name: "No watermark", icon: CheckIcon },
            { name: "Fast generation", icon: CheckIcon },
            { name: "Paid plan", icon: CheckIcon },
        ],
        buttonText: "Subscribe",
    },
    {
        title: "Premium Plan",
        price: 20,
        features: [
            { name: "Unlimited generation", icon: CheckIcon },
            { name: "No watermark", icon: CheckIcon },
            { name: "24/7 Dedicated Support", icon: CheckIcon },
            { name: "Fast generation", icon: CheckIcon },
            { name: "Paid plan", icon: CheckIcon },
        ],
        buttonText: "Subscribe",
    }
];
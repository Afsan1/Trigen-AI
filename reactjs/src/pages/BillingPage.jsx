import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BillingPage() {
    const navigate = useNavigate();
    
    // Redirect /billing to /pricing since they are now unified
    useEffect(() => {
        navigate('/pricing', { replace: true });
    }, [navigate]);

    return null;
}

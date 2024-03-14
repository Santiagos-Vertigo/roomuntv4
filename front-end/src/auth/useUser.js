import { useEffect, useState } from 'react';
import { useToken } from './useToken';

export const useUser = () => {
    const [token] = useToken();

    const getPayloadFromToken = token => {
        try {
            const encodedPayload = token?.split('.')[1];
            return JSON.parse(window.atob(encodedPayload));
        } catch (error) {
            console.error("Failed to parse token payload:", error);
            return null;
        }
    };

    const [user, setUser] = useState(() => {
        if (!token) return null;
        return getPayloadFromToken(token);
    });

    useEffect(() => {
        if (!token) {
            setUser(null);
        } else {
            setUser(getPayloadFromToken(token));
        }
    }, [token]);

    return user;
};

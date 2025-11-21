import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { authService } from '@/services';

interface AvatarContextType {
    avatar: string | null;
    username: string | null;
    updateAvatar: (newAvatar: string) => void;
    updateUsername: (newUsername: string) => void;
    refreshProfile: () => Promise<void>;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const fetchProfile = async () => {
        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
            try {
                // Try to get user profile from auth endpoint (works for all roles)
                const response = await api.get('/auth/profile');
                const profileData = response.data?.data || response.data;
                setAvatar(profileData.avatar || null);
                setUsername(profileData.username || null);
            } catch (error: any) {
                // Silently handle errors (user might not have profile yet)
                if (error.response?.status !== 404) {
                    console.error('Error fetching profile:', error);
                }
                // Try to get username from localStorage as fallback
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setAvatar(null);
                setUsername(user.username || null);
            }
        } else {
            setAvatar(null);
            setUsername(null);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateAvatar = (newAvatar: string) => {
        setAvatar(newAvatar);
    };

    const updateUsername = (newUsername: string) => {
        setUsername(newUsername);
    };

    const refreshProfile = async () => {
        await fetchProfile();
    };

    return (
        <AvatarContext.Provider value={{
            avatar,
            username,
            updateAvatar,
            updateUsername,
            refreshProfile
        }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => {
    const context = useContext(AvatarContext);
    if (context === undefined) {
        throw new Error('useAvatar must be used within an AvatarProvider');
    }
    return context;
};

"use client";
import React, { useContext, useState } from "react";

type UserContextType = {
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    paid: boolean;
    setPaid: React.Dispatch<React.SetStateAction<boolean>>;
    userMetadata: any;
    setUserMetadata: React.Dispatch<React.SetStateAction<any>>;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [paid, setPaid] = useState(false);
    const [userMetadata, setUserMetadata] = useState<any>(null); // Assuming user state is needed


    return (
        <UserContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode,
                paid, setPaid, userMetadata, setUserMetadata
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useClient = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useClient must be used within a UserContextProvider");
    }
    return context;
};

import React, { useContext, createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(-1);

    return (
        <UserContext.Provider value={[userId, setUserId]}>
            {children}
        </UserContext.Provider>
    );

};

// context consumer hook
const useUserContext = () => {
    // get the context
    const context = useContext(UserContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        console.error("useUserContext was used outside of its Provider");
    }

    return context;
};

export { UserContext, UserContextProvider, useUserContext };
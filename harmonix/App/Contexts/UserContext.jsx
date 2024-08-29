import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    return(
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
      </UserContext.Provider>
    )
}
export const useUser = () => useContext(UserContext);
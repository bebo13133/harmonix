import React, { createContext, useState, useContext, useEffect } from 'react';
import startInspectionService from '../Services/startInspectionService';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  //TODO:default state from the FS
  const [completedInThePresenceOf, setCompletedInThePresenceOf] = useState(null);

  useEffect(() => {
    const fetchCompletedInThePresenceOf = async () => {
      try {
        await startInspectionService.completedInThePresenceOf();
      } catch (error) {
        console.error('Error fetching completedInThePresenceOf:', error);
      }
    };
    fetchCompletedInThePresenceOf();
  }, []);

  const contextValue = {
    completedInThePresenceOf,
  };

  return <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>;
};

export const useTest = () => {
  return useContext(TestContext);
};

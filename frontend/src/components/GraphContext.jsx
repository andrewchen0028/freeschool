import React, { useContext, createContext, useState } from 'react';

const GraphContext = createContext();

const GraphContextProvider = ({ children }) => {
    // graphHistory stores the graphs we've visited
    const [graphHistory, setGraphHistory] = useState([]);

    return (
        <GraphContext.Provider value={[graphHistory, setGraphHistory]}>
            {children}
        </GraphContext.Provider>
    );

};

// context consumer hook
const useGraphContext = () => {
    // get the context - this returns [currentGraph, setCurrentGraph]
    const context = useContext(GraphContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        console.error("useGraphContext was used outside of its Provider");
    }

    return context;
};

export { GraphContext, GraphContextProvider, useGraphContext };
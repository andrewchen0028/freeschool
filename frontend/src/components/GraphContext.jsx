import React, { useContext, createContext, useState } from 'react';

const GraphContext = createContext();

const GraphContextProvider = ({ children }) => {
    // -1 means we're at the base level graph. Anything else indicates the id of the node whose graph we're visiting.
    const [currentGraph, setCurrentGraph] = useState(-1);

    return (
        <GraphContext.Provider value={[currentGraph, setCurrentGraph]}>
            {children}
        </GraphContext.Provider>
    );

};

// context consumer hook
const useGraphContext = () => {
    // get the context
    const context = useContext(GraphContext);

    // if `undefined`, throw an error
    if (context === undefined) {
        console.error("useGraphContext was used outside of its Provider");
    }

    return context;
};

export { GraphContext, GraphContextProvider, useGraphContext };
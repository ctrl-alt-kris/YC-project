import React from "react";

export const DataContext = React.createContext({
    auth: "",
    setAuth: () => {},
    activePage: "",
    setActivePage: () => {}
});
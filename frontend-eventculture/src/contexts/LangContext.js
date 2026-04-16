import React, { createContext, useState, useContext } from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

const LangContext = createContext();

const traductions = { fr, en };

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }) => {
    const [langue, setLangue] = useState('fr');

    const t = (key) => {
        return traductions[langue][key] || key;
    };

    const toggleLangue = () => {
        setLangue(langue === 'fr' ? 'en' : 'fr');
    };

    return (
        <LangContext.Provider value={{ langue, t, toggleLangue }}>
            {children}
        </LangContext.Provider>
    );
};
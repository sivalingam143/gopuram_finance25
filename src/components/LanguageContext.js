// File: LanguageContext.js

import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback, 
    useMemo 
} from 'react';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

// Toggle flag: Set to true to disable translation fetch calls temporarily
// const DISABLE_TRANSLATION_FETCH = true;  // <-- Change to false to enable fetches

// --- Global Cache and API Translation Function ---
const translationCache = new Map();

// ✅ HARDCODED FIX: Manually set the correct translation for "Clear" (Reset/Erase)
translationCache.set("Clear", "நீக்கு");

const fetchTamilTranslation = async (text) => {
    if (!text || typeof text !== 'string') return '';
    const trimmedText = text.trim();
    if (translationCache.has(trimmedText)) {
        return translationCache.get(trimmedText);
    }

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(trimmedText)}`
        );
        const result = await response.json();
        const translatedText = result[0][0][0];
        translationCache.set(trimmedText, translatedText);
        return translatedText;
    } catch (error) {
        console.error("Error in translation API for:", trimmedText, error);
        return trimmedText;
    }
};

// --- Language Provider Component ---
export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem("appLanguage") === "TA" ? "TA" : "EN";
    });
    
    // Version number to force re-renders when cache updates
    const [cacheVersion, setCacheVersion] = useState(0); 
    
    const toggleLanguage = () => {
        // Clear cache when language toggled
        translationCache.clear();
        setCurrentLanguage(prevLang => prevLang === "EN" ? "TA" : "EN");
    };

    // Translation function with fetch disabling logic
    const t = useCallback((englishText) => {
        const trimmedText = englishText.trim();
        
        if (currentLanguage === 'EN' || !trimmedText) {
            return englishText; 
        }

        if (translationCache.has(trimmedText)) {
            return translationCache.get(trimmedText); 
        }
        
         fetchTamilTranslation(trimmedText)
            .then(() => {
                // 4. Once the translation is done and cached, force a re-render
                setCacheVersion(prev => prev + 1);
            })
            .catch(() => {});
        // Only fetch translation if disabling flag is false
        // if (!DISABLE_TRANSLATION_FETCH) {
        //     fetchTamilTranslation(trimmedText)
        //         .then(() => {
        //             setCacheVersion(prev => prev + 1);
        //         })
        //         .catch(() => {});
        // }

        // While waiting or if fetch disabled, return English text as fallback
        return englishText; 
    }, [currentLanguage]);

    // Effect to sync language between state and localStorage & document body class
    useEffect(() => {
        localStorage.setItem("appLanguage", currentLanguage);
        document.body.classList.remove('lang-en', 'lang-ta');
        document.body.classList.add(`lang-${currentLanguage.toLowerCase()}`);
    }, [currentLanguage]);

    // Memoize the context value including cacheVersion for updates
    const value = useMemo(() => ({
        currentLanguage,
        toggleLanguage,
        t,
        cacheVersion
    }), [currentLanguage, toggleLanguage, t, cacheVersion]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

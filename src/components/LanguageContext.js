// File: LanguageContext.js

import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback, 
    useMemo // <-- New Import
} from 'react';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

// --- Global Cache and API Translation Function ---
const translationCache = new Map();


// ✅ HARDCODED FIX: Manually set the correct translation for "Clear" (Reset/Erase)
// The correct Tamil word is நீக்கு (Nīkku)
translationCache.set("Clear", "நீக்கு");

const fetchTamilTranslation = async (text) => {
    // ... (Your existing API fetch logic remains here) ...
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


// --- Language Provider Component (FIXED) ---
export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem("appLanguage") === "TA" ? "TA" : "EN";
    });
    
    // ✅ NEW STATE: This version number is incremented to force re-renders
    const [cacheVersion, setCacheVersion] = useState(0); 
    
    const toggleLanguage = () => {
        // Clear cache when language is toggled to ensure fresh translations
        translationCache.clear();
        setCurrentLanguage(prevLang => prevLang === "EN" ? "TA" : "EN");
    };

    // ✅ MODIFIED: The t function is now synchronous, but triggers re-render when API resolves
    const t = useCallback((englishText) => {
        const trimmedText = englishText.trim();
        
        // 1. Immediate return for English or empty text
        if (currentLanguage === 'EN' || !trimmedText) {
            return englishText; 
        }

        // 2. Immediate return if cached (from a previous API call)
        if (translationCache.has(trimmedText)) {
            return translationCache.get(trimmedText); 
        }

        // 3. If not found, asynchronously initiate the fetch
        fetchTamilTranslation(trimmedText)
            .then(() => {
                // 4. Once the translation is done and cached, force a re-render
                setCacheVersion(prev => prev + 1);
            })
            .catch(() => {});

        // 5. IMPORTANT: While waiting for the API, return the English text as a placeholder
        return englishText; 
    }, [currentLanguage]);


    // Effect to update localStorage and body class
    useEffect(() => {
        localStorage.setItem("appLanguage", currentLanguage);
        document.body.classList.remove('lang-en', 'lang-ta');
        document.body.classList.add(`lang-${currentLanguage.toLowerCase()}`);
    }, [currentLanguage]);

    // ✅ Include 'cacheVersion' in the memoized value so components listen for it
    const value = useMemo(() => ({
        currentLanguage,
        toggleLanguage,
        t,
        cacheVersion // Used only to trigger updates in consuming components
    }), [currentLanguage, toggleLanguage, t, cacheVersion]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
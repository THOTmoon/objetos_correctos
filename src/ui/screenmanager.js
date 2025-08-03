// src/ui/ScreenManager.js

export default class ScreenManager {
    /**
     * El constructor recibe un objeto que mapea los nombres de las pantallas a sus elementos del DOM.
     * @param {object} screens - Un objeto como { loading: HTMLElement, start: HTMLElement, ... }.
     */
    constructor(screens) {
        if (!screens || typeof screens !== 'object') {
            throw new Error("ScreenManager requiere un objeto de pantallas para inicializarse.");
        }
        
        this.screens = screens;
        this.currentScreen = null; // Para llevar un registro de la pantalla activa.

        // Nos aseguramos de que todas las pantallas estén ocultas al inicio,
        // excepto la que ya tenga la clase 'active' en el HTML (si la hay).
        this.initializeScreens();
    }

    /**
     * Oculta todas las pantallas al principio para asegurar un estado limpio.
     * @private
     */
    initializeScreens() {
        for (const key in this.screens) {
            const screenElement = this.screens[key];
            if (screenElement) {
                if (screenElement.classList.contains('active')) {
                    this.currentScreen = screenElement;
                } else {
                    screenElement.classList.remove('active');
                }
            }
        }
    }

    /**
     * Muestra una pantalla específica y oculta la anterior.
     * @param {string} screenName - El nombre de la pantalla a mostrar (ej. 'start', 'game', 'end').
     */
    showScreen(screenName) {
        const newScreen = this.screens[screenName];

        if (!newScreen) {
            console.error(`La pantalla "${screenName}" no existe en el ScreenManager.`);
            return;
        }

        if (newScreen === this.currentScreen) {
            console.warn(`La pantalla "${screenName}" ya está activa.`);
            return; // No hacer nada si ya se está mostrando.
        }

        // Oculta la pantalla actual si hay una.
        if (this.currentScreen) {
            this.currentScreen.classList.remove('active');
        }

        // Muestra la nueva pantalla.
        newScreen.classList.add('active');

        // Actualiza la referencia a la pantalla actual.
        this.currentScreen = newScreen;

        console.log(`Mostrando pantalla: ${screenName}`);
    }
}
// src/main.js (VERSIÓN FINAL CON NUEVO FLUJO)

import { gameConfig } from './config/gameconfig.js'; 
import GameManager from './game/gamemanager.js';
import AssetLoader from './utils/assetloader.js';
import ScreenManager from './ui/screenmanager.js';
import UIUpdater from './ui/uiupdater.js';

async function main() {
    console.log("Juego inicializando...");

    const screens = {
        loading: document.getElementById('loading-screen'),
        splash: document.getElementById('splash-screen'),
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        end: document.getElementById('end-screen')
    };

    const screenManager = new ScreenManager(screens);
    const assetLoader = new AssetLoader();
    let uiUpdater;

    screenManager.showScreen('loading');

    try {
        const imagesToLoad = [
            ...gameConfig.objects.map(obj => obj.image),
            ...gameConfig.rooms.map(room => room.image),
            'assets/images/logo.png',
            'assets/images/buhosabio.png'
        ];
        await assetLoader.loadImages(imagesToLoad);
        console.log("Imágenes cargadas.");

        const soundPaths = gameConfig.sounds;
        const [correctSound, incorrectSound, buttonStartSound, backgroundMusic] = await Promise.all([
            assetLoader.loadSound(soundPaths.correct),
            assetLoader.loadSound(soundPaths.incorrect),
            assetLoader.loadSound(soundPaths.buttonStart),
            assetLoader.loadSound(soundPaths.backgroundMusic)
        ]);
        
        const loadedSounds = {
            effects: { correct: correctSound, incorrect: incorrectSound, buttonStart: buttonStartSound },
            music: backgroundMusic
        };
        console.log("Sonidos cargados.");

        uiUpdater = new UIUpdater(assetLoader, loadedSounds);
        const gameManager = new GameManager(gameConfig, screenManager, uiUpdater);

        uiUpdater.setupAudioControls();
        console.log("Todos los assets han sido cargados y asignados.");
        
        // --- CAMBIO DE LÓGICA PRINCIPAL ---
        // 1. Al terminar la carga, vamos directamente al MENÚ PRINCIPAL.
        screenManager.showScreen('start');
        
        const startButton = document.getElementById('start-game-btn');
        const restartButton = document.getElementById('restart-game-btn');

        // 2. El botón de inicio ahora tiene una nueva secuencia de tareas.
        startButton.addEventListener('click', () => {
            // Tarea A: Reproducir sonido de feedback inmediato.
            uiUpdater.playSound('buttonStart');
            
            // Tarea B: Mostrar la pantalla del logo.
            screenManager.showScreen('splash');

            // Tarea C: Configurar un temporizador para lo que pasará después.
            setTimeout(() => {
                // Después de 3 segundos...
                // Iniciar la música de fondo.
                uiUpdater.startBackgroundMusic();
                // Iniciar la lógica del juego (esto también cambiará a la pantalla 'game').
                gameManager.startGame();
            }, 3000); // 3000 milisegundos = 3 segundos
        });

        // El botón de reinicio sigue funcionando igual.
        restartButton.addEventListener('click', () => {
            gameManager.startGame();
        });

    } catch (error) {
        console.error("Error FATAL durante la carga. El juego no puede iniciar.", error);
        screens.loading.innerHTML = `<h1>Error al cargar</h1><p>No se pudo iniciar el juego. Revisa la consola (F12) para más detalles.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', main);
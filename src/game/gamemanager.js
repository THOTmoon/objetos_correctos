// src/game/GameManager.js (CORREGIDO CON LÓGICA DE FIN DE JUEGO)

import { GameStates } from './gamestates.js';
import DragDropHandler from '../utils/dragdrophandler.js';

export default class GameManager {
    constructor(config, screenManager, uiUpdater) {
        this.config = config;
        this.screenManager = screenManager;
        this.uiUpdater = uiUpdater;

        this.currentState = GameStates.MENU;
        this.score = 0;
        this.timeLeft = this.config.gameRules.timeLimitSeconds;
        this.timer = null;
        
        this.currentRoom = null;
        this.correctObjectsInRound = [];
        
        // ¡NUEVO! Para llevar un registro de las habitaciones no jugadas.
        this.availableRooms = [];

        this.dragDropHandler = new DragDropHandler(
            '#objects-area',
            '.draggable-object',
            '.drop-zone',
            this.handleDrop.bind(this)
        );
    }

    startGame() {
        console.log("Iniciando partida...");
        this.currentState = GameStates.PLAYING;
        this.score = 0;
        this.timeLeft = this.config.gameRules.timeLimitSeconds;
        this.uiUpdater.updateScore(this.score);
        this.uiUpdater.updateTime(this.timeLeft);

        // ¡CAMBIO IMPORTANTE! Preparamos y barajamos la lista de habitaciones disponibles al inicio del juego.
        // Esto crea una "pila" de habitaciones que iremos sacando una a una.
        this.availableRooms = [...this.config.rooms].sort(() => 0.5 - Math.random());

        this.prepareRound();
        this.startTimer();
        this.screenManager.showScreen('game');
    }

    endGame() {
        if (this.currentState !== GameStates.PLAYING) return;
        
        console.log("Partida terminada.");
        this.currentState = GameStates.GAME_OVER;
        clearInterval(this.timer);
        this.uiUpdater.updateFinalScore(this.score);
        this.screenManager.showScreen('end');
    }

    /**
     * Prepara la ronda con la nueva lógica. Ahora sabe cuándo terminar el juego.
     */
    prepareRound() {
        if (this.availableRooms.length === 0) {
            console.log("¡Todas las habitaciones completadas! Fin del juego.");
            this.endGame();
            return;
        }
    
        this.currentRoom = this.availableRooms.pop();
    
        const allObjects = [...this.config.objects];
        
        // La lógica de objetos correctos no cambia.
        const correctObjects = allObjects.filter(obj => obj.targetRoom === this.currentRoom.id);
        
        // --- LÓGICA DE OBJETOS INCORRECTOS MEJORADA ---
    
        // 1. Obtenemos la lista inicial de incorrectos (todos los que no pertenecen a esta habitación).
        const incorrectObjects = allObjects.filter(obj => obj.targetRoom !== this.currentRoom.id);
    
        // 2. Obtenemos la "lista negra" para la habitación actual desde la configuración.
        //    Usamos '|| []' para evitar errores si una habitación no tiene restricciones definidas.
        const restrictions = this.config.roomRestrictions[this.currentRoom.id] || [];
    
        // 3. Aplicamos el filtro de la lista negra.
        //    Creamos una nueva lista que excluye cualquier objeto cuyo ID esté en la lista de restricciones.
        const filteredIncorrectObjects = incorrectObjects.filter(obj => !restrictions.includes(obj.id));
        
        // A partir de aquí, usamos la nueva lista 'filteredIncorrectObjects' en lugar de 'incorrectObjects'.
        const shuffledCorrect = correctObjects.sort(() => 0.5 - Math.random());
        const shuffledIncorrect = filteredIncorrectObjects.sort(() => 0.5 - Math.random());
        
        const selectedCorrect = shuffledCorrect.slice(0, this.config.gameRules.numCorrectObjectsPerRound);
        const selectedIncorrect = shuffledIncorrect.slice(0, this.config.gameRules.numIncorrectObjectsPerRound);
    
        this.correctObjectsInRound = [...selectedCorrect];
    
        const roundObjects = [...selectedCorrect, ...selectedIncorrect].sort(() => 0.5 - Math.random());
        
        this.uiUpdater.createRoom(this.currentRoom);
        console.log("Preparando ronda para:", this.currentRoom.name, ". Objetos prohibidos:", restrictions);
        this.uiUpdater.createObjects(roundObjects);
    
        this.dragDropHandler.init();
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.uiUpdater.updateTime(this.timeLeft);
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    handleDrop(draggedElement, dropZone) {
        if (!draggedElement || !dropZone) return;

        const objectId = draggedElement.dataset.id;
        const objectData = this.config.objects.find(obj => obj.id === objectId);

        if (objectData && objectData.targetRoom === this.currentRoom.id) {
            this.handleCorrectDrop(draggedElement);
        } else {
            this.handleIncorrectDrop(draggedElement);
        }
    }

    handleCorrectDrop(element) {
        console.log("¡Correcto!");
        this.score += this.config.gameRules.pointsPerCorrect;
        this.uiUpdater.updateScore(this.score);
        this.uiUpdater.showFeedback(true, this.config.feedback.messageDurationMs);

        element.style.visibility = 'hidden';

        this.correctObjectsInRound = this.correctObjectsInRound.filter(obj => obj.id !== element.dataset.id);
        
        if (this.correctObjectsInRound.length === 0) {
            console.log("¡Ronda completada!");
            // La llamada a prepareRound ahora es más inteligente: o prepara la siguiente
            // habitación única o detecta que ya no hay más y termina el juego.
            setTimeout(() => this.prepareRound(), 1500); 
        }
    }

    handleIncorrectDrop(element) {
        console.log("¡Incorrecto!");
        this.score += this.config.gameRules.pointsPerIncorrect;
        this.uiUpdater.updateScore(this.score);
        this.uiUpdater.showFeedback(false, this.config.feedback.messageDurationMs);
        
        // Devolvemos el objeto a su sitio visualmente.
        const ddh = this.dragDropHandler;
        if (ddh && ddh.returnToOriginalPosition) {
             // En la versión anterior de D&D, este método no existía. Lo añadimos por seguridad.
        } else {
            // Si el método no existe, simplemente lo hacemos visible de nuevo
            element.classList.remove('dragging');
            element.style.position = '';
            element.style.left = '';
            element.style.top = '';
        }
    }
}
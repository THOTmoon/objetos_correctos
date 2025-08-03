// src/ui/uiuupdater.js (VERSIÓN CORREGIDA Y COMPLETA)

export default class UIUpdater {
    constructor(assetLoader, sounds) {
        this.$scoreDisplay = document.getElementById('score-display');
        this.$timeDisplay = document.getElementById('time-display');
        this.$finalScore = document.getElementById('final-score');
        this.$objectsArea = document.getElementById('objects-area');
        this.$roomsArea = document.getElementById('rooms-area');
        this.$feedbackMessage = document.getElementById('feedback-message');
        this.$musicToggleBtn = document.getElementById('bg-music-toggle');
        
        this.assetLoader = assetLoader;
        
        this.sounds = sounds.effects || {};
        this.backgroundMusic = sounds.music || null;
    }

    setupAudioControls() {
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.3;
        }

        if (this.$musicToggleBtn) {
            this.$musicToggleBtn.addEventListener('click', () => {
                this.toggleBackgroundMusic();
            });
        }
    }

    /**
     * Inicia la música de fondo SOLO si está pausada.
     * Esta función es segura para ser llamada como una orden de "inicio".
     */
    startBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.paused) {
            this.toggleBackgroundMusic();
        }
    }

    /**
     * Alterna el estado de la música (play/pause) y actualiza el icono del botón.
     * Usada por el botón de control en la pantalla de juego.
     */
    toggleBackgroundMusic() {
        if (!this.backgroundMusic) return;

        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(e => console.warn("La reproducción automática de música fue bloqueada."));
            this.$musicToggleBtn.textContent = '🎵';
            this.$musicToggleBtn.classList.remove('muted');
        } else {
            this.backgroundMusic.pause();
            this.$musicToggleBtn.textContent = '🔇';
            this.$musicToggleBtn.classList.add('muted');
        }
    }

    updateScore(score) {
        this.$scoreDisplay.textContent = score;
    }

    updateTime(time) {
        this.$timeDisplay.textContent = time;
    }

    updateFinalScore(score) {
        this.$finalScore.textContent = score;
    }

    createObjects(objects) {
        this.$objectsArea.innerHTML = '';
        const row1 = document.createElement('div');
        row1.classList.add('object-row');
        const row2 = document.createElement('div');
        row2.classList.add('object-row');
        const firstFive = objects.slice(0, 5);
        const lastFive = objects.slice(5, 10);

        firstFive.forEach(obj => {
            const objectElement = document.createElement('img');
            objectElement.src = obj.image;
            objectElement.alt = `Objeto ${obj.id}`;
            objectElement.classList.add('draggable-object');
            objectElement.dataset.id = obj.id;
            row1.appendChild(objectElement);
        });
        lastFive.forEach(obj => {
            const objectElement = document.createElement('img');
            objectElement.src = obj.image;
            objectElement.alt = `Objeto ${obj.id}`;
            objectElement.classList.add('draggable-object');
            objectElement.dataset.id = obj.id;
            row2.appendChild(objectElement);
        });

        this.$objectsArea.appendChild(row1);
        this.$objectsArea.appendChild(row2);
    }

    createRoom(room) {
        this.$roomsArea.innerHTML = '';
        const roomElement = document.createElement('div');
        roomElement.classList.add('drop-zone');
        roomElement.dataset.roomId = room.id;
        roomElement.style.backgroundImage = `url(${room.image})`;
        this.$roomsArea.appendChild(roomElement);
    }

    showFeedback(isCorrect, durationMs) {
        this.$feedbackMessage.textContent = isCorrect ? '¡Correcto!' : '¡Inténtalo de nuevo!';
        this.$feedbackMessage.classList.add('show');
        this.$feedbackMessage.classList.toggle('correct', isCorrect);
        this.$feedbackMessage.classList.toggle('incorrect', !isCorrect);
        this.playSound(isCorrect ? 'correct' : 'incorrect');
        setTimeout(() => {
            this.$feedbackMessage.classList.remove('show', 'correct', 'incorrect');
        }, durationMs);
    }

    shakeElement(element) {
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    }

    playSound(type) {
        if (this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play().catch(e => console.warn("No se pudo reproducir el sonido:", e));
        }
    }
}
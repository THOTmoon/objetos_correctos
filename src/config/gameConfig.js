// src/config/gameConfig.js (VERSIÓN FINAL CON MINÚSCULAS)

export const gameConfig = {
    objects: [
        { id: 'pan', image: 'assets/images/objects/pan.png', targetRoom: 'kitchen' },
        { id: 'shampoo', image: 'assets/images/objects/shampoo.png', targetRoom: 'bathroom' },
        { id: 'pastadental', image: 'assets/images/objects/pastadental.png', targetRoom: 'bathroom' },
        { id: 'patitohule', image: 'assets/images/objects/patitohule.png', targetRoom: 'bathroom' },
        { id: 'cepillo', image: 'assets/images/objects/cepillo.png', targetRoom: 'bathroom' },
        { id: 'toalla', image: 'assets/images/objects/toalla.png', targetRoom: 'bathroom' },
        { id: 'aceite', image: 'assets/images/objects/aceite.png', targetRoom: 'kitchen' },
        { id: 'cucharon', image: 'assets/images/objects/cucharon.png', targetRoom: 'kitchen' },
        { id: 'tabla', image: 'assets/images/objects/tabla.png', targetRoom: 'kitchen' },
        { id: 'lamparanoche', image: 'assets/images/objects/lamparanoche.png', targetRoom: 'bedroom' },
        { id: 'libro', image: 'assets/images/objects/libro.png', targetRoom: 'bedroom' },
        { id: 'despertador', image: 'assets/images/objects/despertador.png', targetRoom: 'bedroom' },
        { id: 'peluche', image: 'assets/images/objects/peluche.png', targetRoom: 'bedroom' },
        { id: 'pillow', image: 'assets/images/objects/pillow.png', targetRoom: 'bedroom' },
        { id: 'sal', image: 'assets/images/objects/sal.png', targetRoom: 'diningroom' },
        { id: 'vaso', image: 'assets/images/objects/vaso.png', targetRoom: 'diningroom' },
        { id: 'panera', image: 'assets/images/objects/panera.png', targetRoom: 'diningroom' },
        { id: 'jarra', image: 'assets/images/objects/jarra.png', targetRoom: 'diningroom' },
        { id: 'plate', image: 'assets/images/objects/plate.png', targetRoom: 'diningroom' },
        { id: 'hoya', image: 'assets/images/objects/hoya.png', targetRoom: 'kitchen' },
        { id: 'sofa', image: 'assets/images/objects/sofa.png', targetRoom: 'livingroom' },
        { id: 'televisor', image: 'assets/images/objects/televisor.png', targetRoom: 'livingroom' },
        { id: 'biblioteca', image: 'assets/images/objects/biblioteca.png', targetRoom: 'livingroom' },
        { id: 'controlremoto', image: 'assets/images/objects/controlremoto.png', targetRoom: 'livingroom' },
        { id: 'florero', image: 'assets/images/objects/florero.png', targetRoom: 'livingroom' }
    ],
    rooms: [
        { id: 'kitchen', name: 'Cocina', image: 'assets/images/rooms/kitchen.png' },
        { id: 'bathroom', name: 'Baño', image: 'assets/images/rooms/bathroom.png' },
        { id: 'bedroom', name: 'Dormitorio', image: 'assets/images/rooms/bedroom.png' },
        { id: 'diningroom', name: 'Comedor', image: 'assets/images/rooms/comedor.png' },
        { id: 'livingroom', name: 'Sala', image: 'assets/images/rooms/sala.png' }
    ],
    gameRules: {
        pointsPerCorrect: 10,
        pointsPerIncorrect: -5,
        timeLimitSeconds: 250,
        numCorrectObjectsPerRound: 5,
        numIncorrectObjectsPerRound: 5
    },
    feedback: {
        messageDurationMs: 1000
    },
    sounds: {
        correct: 'assets/sounds/correct.mp3',
        incorrect: 'assets/sounds/incorrect.mp3',
        buttonStart: 'assets/sounds/inicioboton.mp3',
        backgroundMusic: 'assets/sounds/musicafondo.mp3'
    },

    // --- NUEVA SECCIÓN DE RESTRICCIONES ---
    roomRestrictions: {
        // En la 'cocina', NUNCA mostrar 'plato' como opción incorrecta.
        kitchen: ['plate'],
        
        // Puedes añadir más reglas aquí en el futuro. Por ejemplo:
        // En el 'baño', nunca mostrar 'libro' o 'peluche'.
        bathroom: ['libro', 'peluche']
    }


};


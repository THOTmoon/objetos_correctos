// src/utils/AssetLoader.js

export default class AssetLoader {
    constructor() {
        this.imagePaths = [];
        this.soundPaths = [];
    }

    /**
     * Carga un array de rutas de imágenes y devuelve una promesa que se resuelve
     * cuando todas las imágenes han sido cargadas.
     * @param {Array<string>} imagePaths - Un array de strings con las rutas a las imágenes.
     * @returns {Promise<void>}
     */
    loadImages(imagePaths) {
        // Creamos un array de promesas. Cada promesa representará la carga de una imagen.
        const promises = imagePaths.map(path => this.loadImage(path));

        // Promise.all() es una herramienta fantástica. Toma un array de promesas y
        // devuelve una única promesa que se resolverá solo cuando TODAS las promesas
        // del array se hayan resuelto. Si alguna falla, Promise.all() se rechazará.
        return Promise.all(promises);
    }

    /**
     * Carga una única imagen.
     * @private
     * @param {string} path - La ruta a la imagen.
     * @returns {Promise<HTMLImageElement>} - Una promesa que se resuelve con el elemento de imagen cargado.
     */
    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Asignamos los listeners ANTES de asignar el 'src'. Esto es importante
            // para no perder los eventos si la imagen se carga muy rápido desde la caché.
            
            // Si la imagen se carga correctamente, la promesa se resuelve.
            img.onload = () => {
                console.log(`Imagen cargada: ${path}`);
                resolve(img);
            };

            // Si hay un error al cargar la imagen (ej. ruta incorrecta, 404), la promesa se rechaza.
            img.onerror = () => {
                const errorMsg = `No se pudo cargar la imagen en la ruta: ${path}`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            };

            // Iniciar la carga de la imagen.
            img.src = path;
        });
    }

    /**
     * (Futura Expansión) Carga un array de rutas de sonidos.
     * @param {Array<string>} soundPaths - Un array de strings con las rutas a los archivos de audio.
     * @returns {Promise<void>}
     */
    loadSounds(soundPaths) {
        // La lógica sería muy similar a la de las imágenes, pero usando el objeto Audio.
        console.log("Cargando sonidos (funcionalidad futura)...");
        const promises = soundPaths.map(path => this.loadSound(path));
        return Promise.all(promises);
    }

    /**
     * (Futura Expansión) Carga un único archivo de sonido.
     * @private
     * @param {string} path - La ruta al sonido.
     * @returns {Promise<HTMLAudioElement>}
     */
    loadSound(path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            // El evento 'canplaythrough' asegura que el audio está suficientemente
            // cargado para reproducirse hasta el final sin interrupciones.
            audio.oncanplaythrough = () => {
                console.log(`Sonido cargado: ${path}`);
                this.soundPaths.push(audio);
                resolve(audio);
            };
            audio.onerror = () => {
                const errorMsg = `No se pudo cargar el sonido en la ruta: ${path}`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            };
            audio.src = path;
        });
    }
}
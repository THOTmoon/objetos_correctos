// src/utils/DragDropHandler.js (VERSIÓN VISUALMENTE ROBUSTA)

export default class DragDropHandler {
    constructor(objectsContainerSelector, draggableSelector, dropZoneSelector, onDropCallback) {
        this.container = document.querySelector(objectsContainerSelector);
        this.draggableSelector = draggableSelector;
        this.dropZoneSelector = dropZoneSelector;
        this.onDropCallback = onDropCallback;

        this.draggedElement = null;
        this.offsetX = 0;
        this.offsetY = 0;

        // Propiedades para devolver el objeto a su sitio si el drop es inválido
        this.originalParent = null;
        this.originalNextSibling = null;

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
    }

    init() {
        if (this.container) {
            this.container.removeEventListener('mousedown', this.handleDragStart);
            this.container.removeEventListener('touchstart', this.handleDragStart);
            
            this.container.addEventListener('mousedown', this.handleDragStart);
            this.container.addEventListener('touchstart', this.handleDragStart, { passive: false });
        }
    }

    handleDragStart(e) {
        const target = e.target.closest(this.draggableSelector);
        // No iniciar arrastre si el objeto no es válido o ya está oculto
        if (!target || target.style.visibility === 'hidden') return;

        e.preventDefault();
        this.draggedElement = target;

        // Guardamos su posición original para poder devolverlo
        this.originalParent = this.draggedElement.parentNode;
        this.originalNextSibling = this.draggedElement.nextSibling;

        const isTouchEvent = e.type === 'touchstart';
        const event = isTouchEvent ? e.touches[0] : e;
        
        const rect = this.draggedElement.getBoundingClientRect();
        this.offsetX = event.clientX - rect.left;
        this.offsetY = event.clientY - rect.top;

        // Hacemos el elemento "fantasma" aplicándole la clase y moviéndolo al body
        this.draggedElement.classList.add('dragging');
        document.body.appendChild(this.draggedElement); // Clave: lo movemos al body para que flote libremente

        // Lo posicionamos en el punto exacto donde estaba el cursor
        this.draggedElement.style.position = 'absolute';
        this.draggedElement.style.left = `${event.clientX - this.offsetX}px`;
        this.draggedElement.style.top = `${event.clientY - this.offsetY}px`;

        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('touchmove', this.handleDrag, { passive: false });
        document.addEventListener('mouseup', this.handleDragEnd);
        document.addEventListener('touchend', this.handleDragEnd);
    }

    handleDrag(e) {
        if (!this.draggedElement) return;
        
        e.preventDefault();

        const isTouchEvent = e.type === 'touchmove';
        const event = isTouchEvent ? e.touches[0] : e;

        // Movemos el objeto siguiendo el puntero
        this.draggedElement.style.left = `${event.clientX - this.offsetX}px`;
        this.draggedElement.style.top = `${event.clientY - this.offsetY}px`;
        
        this.updateDropZoneFeedback(event.clientX, event.clientY);
    }

    handleDragEnd(e) {
        if (!this.draggedElement) return;

        const endEvent = e.changedTouches ? e.changedTouches[0] : e;
        const dropZone = this.getDropZoneAt(endEvent.clientX, endEvent.clientY);
        
        this.clearDropZoneFeedback();

        if (dropZone) {
            this.onDropCallback(this.draggedElement, dropZone);
        }

        // Si el GameManager no ocultó el objeto (fallo), lo devolvemos a su sitio
        if (this.draggedElement.style.visibility !== 'hidden') {
            this.returnToOriginalPosition();
        }

        this.draggedElement.classList.remove('dragging');
        this.draggedElement = null;

        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('touchmove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.removeEventListener('touchend', this.handleDragEnd);
    }

    updateDropZoneFeedback(x, y) {
        const dropZone = this.getDropZoneAt(x, y);
        document.querySelectorAll(this.dropZoneSelector).forEach(zone => {
            if (zone === dropZone) {
                zone.classList.add('drag-over');
            } else {
                zone.classList.remove('drag-over');
            }
        });
    }

    getDropZoneAt(x, y) {
        this.draggedElement.style.display = 'none'; // Oculta para ver debajo
        const elementUnderneath = document.elementFromPoint(x, y);
        this.draggedElement.style.display = ''; // Muestra de nuevo
        return elementUnderneath ? elementUnderneath.closest(this.dropZoneSelector) : null;
    }

    clearDropZoneFeedback() {
        document.querySelectorAll(this.dropZoneSelector).forEach(zone => {
            zone.classList.remove('drag-over');
        });
    }

    returnToOriginalPosition() {
        this.draggedElement.style.position = '';
        this.draggedElement.style.left = '';
        this.draggedElement.style.top = '';

        if (this.originalParent) {
            this.originalParent.insertBefore(this.draggedElement, this.originalNextSibling);
        }
    }
}
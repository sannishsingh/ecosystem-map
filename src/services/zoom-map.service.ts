import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomMapService {

  scale = 1;
  minScale = .8;
  isMouseDown = false;
  mouseStartPos = { x: 0, y: 0 };
  draggableStartPos = { x: 0, y: 0 };

  constructor() { }


  // Zoom in and zoom out
  onWheel(event: WheelEvent, zoomAbleMap: any, zoomAbleDiv: any): void {
    event.preventDefault();
    const zoom = event.deltaY > 0 ? 0.9 : 1.1;
    this.scale *= zoom;
    const newScale = this.scale * zoom;
    if (newScale < this.minScale) { // check if new scale is below minimum allowed level
      this.scale = this.minScale;
      return;
    }
    zoomAbleMap.style.transform = `scale(${this.scale})`;
    zoomAbleDiv.classList.toggle('zoomed', this.scale !== 1);
    if (this.scale !== 1) {
      zoomAbleMap.style.pointerEvents = 'auto';
    } else {
      zoomAbleMap.style.pointerEvents = 'none';
    }
  }

  onMouseDown(event: MouseEvent, zoomAbleMap: any, zoomAbleDiv: any): void {
    if (zoomAbleDiv.classList.contains('zoomed')) {
      this.isMouseDown = true;
      this.mouseStartPos.x = event.pageX;
      this.mouseStartPos.y = event.pageY;
      this.draggableStartPos.x = zoomAbleMap.offsetLeft;
      this.draggableStartPos.y = zoomAbleMap.offsetTop;
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.isMouseDown = false;
  }

  onMouseMove(event: MouseEvent, zoomAbleMap: any): void {
    // Left mouse button is pressed
    if (this.isMouseDown && event.buttons === 1) {
      const deltaX = event.pageX - this.mouseStartPos.x;
      const deltaY = event.pageY - this.mouseStartPos.y;
      zoomAbleMap.style.left = `${this.draggableStartPos.x + deltaX}px`;
      zoomAbleMap.style.top = `${this.draggableStartPos.y + deltaY}px`;
    }
  }

}

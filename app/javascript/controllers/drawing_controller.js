import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="drawing"
export default class extends Controller {
  static targets = ["canvas"];

  connect() {
    console.log("Hello stimulus", this.element)

    this.canvas = this.canvasTarget
    this.canvas.width = 400
    this.canvas.height = 400

    this.ctx = this.canvas.getContext("2d")
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = "black"
    this.ctx.fillStyle = "white"

    this.canvas.addEventListener("mousedown", this.startDrawing.bind(this))
    this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this))
    this.canvas.addEventListener("mousemove", this.draw.bind(this))

    if (this.data.has('drawable')) {
      const image = new Image()
      image.src = this.data.get('drawable')
      image.onload = () => this.ctx.drawImage(image, 0, 0)
    }
  }

  startDrawing(event) {
    this.drawing = true
    this.draw(event)
  }

  stopDrawing() {
    this.drawing = false
    this.ctx.beginPath()

    this.uploadToActiveStorage()
  }

  draw(event) {
    if (!this.drawing) {
      return
    }

    this.ctx.lineTo(event.clientX, event.clientY)
    this.ctx.stroke()
    this.ctx.beginPath()
    this.ctx.moveTo(event.clientX, event.clientY)
  }

  uploadToActiveStorage() {
    const drawing_id = this.data.get('id')
    const dataURL = this.canvas.toDataURL('image/png')

    fetch(`/drawable/${drawing_id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        drawing: {
          drawable: dataURL
        }
      })
    })
  }

  clear(e) {
    e.preventDefault()
    e.stopImmediatePropagation()

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.beginPath()
    this.uploadToActiveStorage()
  }
}

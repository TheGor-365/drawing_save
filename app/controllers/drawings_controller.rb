class DrawingsController < ApplicationController
  before_action :set_drawing, only: %i[ show edit update destroy ]

  def index
    @drawings = Drawing.all
  end

  def show; end
  def edit; end

  def drawable
    data = drawing_params[:drawable]
    data = data.split(',')[1]
    data = Base64.decode64(data)

    file = Tempfile.new(['image', '.png'])
    file.binmode
    file.write(data)
    file.rewind

    @drawing = Drawing.find(params[:id])
    @drawing.image.attach(io: file, filename: 'image.png')
    file.unlink
  end

  def new
    @drawing = Drawing.new
  end

  def create
    @drawing = Drawing.new(drawing_params)
    respond_to do |format|
      if @drawing.save
        format.html { redirect_to drawing_url(@drawing), notice: "Drawing was successfully created." }
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @drawing.update(drawing_params)
        format.html { redirect_to drawing_url(@drawing), notice: "Drawing was successfully updated." }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @drawing.destroy
    respond_to do |format|
      format.html { redirect_to drawings_url, notice: "Drawing was successfully destroyed." }
    end
  end

  private
  def set_drawing
    @drawing = Drawing.find(params[:id])
  end

  def drawing_params
    params.require(:drawing).permit(:title, :image, :drawable)
  end
end

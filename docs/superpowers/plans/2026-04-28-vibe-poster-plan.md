# Vibe Poster Implementation Plan

## Phase 1: Scaffolding & Setup
1. **Initialize Project**: Create a new React + Vite project with TypeScript and Tailwind CSS.
2. **Clean Up**: Remove default Vite boilerplate and set up the main layout container (mobile-first styling).
3. **Asset Preparation**: Find or generate a default noise texture image for the film grain effect.

## Phase 2: Core Components & Image Upload
1. **Uploader Component**: Build a drag-and-drop / click-to-upload area.
2. **State Management**: Set up state for the uploaded image URL, extracted color, generated text, and current date.
3. **Canvas Component Skeleton**: Create the main `PosterCanvas` component that will handle the drawing.

## Phase 3: Canvas Processing & Logic
1. **Image Drawing**: Implement drawing the uploaded image onto the lower half of the Canvas.
2. **Color Extraction**: Write utility to sample the top pixels of the uploaded image and calculate the average RGB. Fill the upper half of the Canvas with this color.
3. **Text Rendering**: Draw the main caption and date on the Canvas using appropriate fonts (e.g., Courier or a web serif font).

## Phase 4: AI Mock & Texture
1. **AI Mock Service**: Create a function that simulates a delay and returns a random atmospheric phrase when an image is uploaded.
2. **Noise Overlay**: Implement the logic to draw the noise texture over the entire Canvas using `globalCompositeOperation` to blend it.

## Phase 5: Polish & Export
1. **Interactivity**: (Optional for V1 Canvas, but can use DOM overlays for editing) Allow clicking on the text to open a prompt/input to change the text and redraw the Canvas.
2. **Export Function**: Add a "Download" button that converts the Canvas to a data URL and triggers a file download.
3. **Responsive UI**: Ensure the canvas and UI scale nicely on desktop and mobile screens.
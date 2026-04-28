# Vibe Poster Design Spec

## 1. Overview
A pure frontend web application (React + Vite) that allows users to upload a landscape photo and automatically generates a minimalist, film-style poster. The poster features a solid background color extracted from the top edge of the photo, an AI-generated atmospheric English caption, the current date, and an overall film grain texture.

## 2. Core Features & User Flow
1. **Upload**: User uploads an image via click or drag-and-drop.
2. **Processing**:
   - **Color Extraction**: Automatically sample the top ~10% of the uploaded image to calculate the average color for the upper background.
   - **AI Caption Generation**: (Mocked initially, configurable API later) Send the image to an AI Vision API to generate a short, atmospheric English phrase.
3. **Preview & Edit**:
   - Display the generated poster in a mobile-first, vertical aspect ratio layout.
   - Layout: Top half is the extracted solid color with centered text; Bottom half is the uploaded photo.
   - Texture: A global noise/grain layer is applied to simulate film.
   - Editability: Users can click the text to edit the caption/date directly. A hidden/subtle color picker allows manual adjustment of the background color.
4. **Export**: A "Download" button to export the final canvas as a high-resolution image (PNG/JPEG).

## 3. UI/UX Design
- **Style**: Minimalist, generous whitespace, indie-magazine/film-camera aesthetic.
- **Typography**: Serif or Monospace fonts for the text, with wide letter-spacing.
- **Layout**: Mobile-first design. On desktop, it appears as a centered mobile-proportioned card.

## 4. Technical Architecture
- **Framework**: React 18+ with Vite.
- **Styling**: Tailwind CSS (or standard CSS/styled-components depending on final setup).
- **Image Processing**: HTML5 `<canvas>` API.
  - Draw background rect -> Draw image -> Draw text -> Overlay noise pattern (using `globalCompositeOperation`).
- **AI Integration**:
  - Implement a mock service first for rapid UI development.
  - Add a settings modal for users to input their own API Key (e.g., OpenAI/Anthropic) for real vision-based generation. All API calls happen client-side.
- **State Management**: React Context or simple state for holding image data, extracted color, and generated text.

## 5. Implementation Phases
1. **Phase 1: Scaffolding & Basic UI**: Set up Vite project, create upload zone and basic layout.
2. **Phase 2: Canvas Processing**: Implement image drawing, color extraction, and basic text rendering on Canvas.
3. **Phase 3: AI & Texture**: Add the mock AI generation, implement the noise overlay layer.
4. **Phase 4: Polish & Export**: Implement text editing, color fine-tuning, and the image download functionality.
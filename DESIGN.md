# Visual Identity & Design Guidelines (DESIGN.md)

This document outlines the strict visual identity and brand guidelines for the Q&A WebApp game. All developers and AI agents must adhere to these specifications.

## 1. Color Palette
The UI must feature a dark, flat design using the following exact HEX color codes:

- **Backgrounds & Base:** `#11001C`, `#290025`, `#35012C`
- **Accents, Cards, & Buttons:** `#3A015C`, `#4F0147`
- **Text Color:** `#FFFFFF` (White) - Strictly use white for all text, specifically for questions and answers, to ensure maximum readability against the dark backgrounds.

## 2. Typography
- **Local Fonts Only:** Do not use Google Fonts or any external CDNs.
- **Path:** Write CSS `@font-face` rules pointing to local files in the `fonts/` directory. 

## 3. Logos & Brand Assets
Use the following exact relative paths for image source tags (`<img src="...">`) in the HTML structure:

- **Icon Logo:** `logo/logo.png` (Place prominently in the header or main interface).
- **Text Logo:** `logo/textlogo.png` (Place alongside or near the icon logo).
- **Developer Logo:** `logo/jassim.png` (Display as a small icon/credit in the footer of the main page).

## 4. UI/UX Rules
- **Style:** Strictly flat design. Do not use CSS gradients, heavy 3D effects, or large drop shadows.
- **Direction:** RTL (Right-to-Left) layout is mandatory across the entire application.
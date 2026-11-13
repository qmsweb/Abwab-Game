Act as a Multi-Agent AI System (Plan, Build, Scout, Review) to develop a responsive, static WebApp game (HTML, CSS, Vanilla JS) ready to be hosted on GitHub Pages without any backend.

PROJECT OVERVIEW:
A competitive Q&A game (similar to "Seen Jeem") played between two teams, managed by a Game Master (the user interacting with the screen). The UI must be a clean, slightly dark-themed flat design, fully responsive, and strictly RTL (Right-to-Left) for Arabic content. 

AGENT ROLES & WORKFLOW:
1. Plan Agent (Architect): Design the state management and file structure (index.html, style.css, script.js, and a data.js file for mock questions).
2. Build Agent (Developer): Write the clean code, implement the UI, and build the JS game logic.
3. Scout Agent (QA): Ensure compatibility, check for logic loopholes, and verify there are no backend dependencies.
4. Review Agent (Reviewer): Polish the UI, ensure smooth transitions, verify RTL layout, and output the final code.

GAME MECHANICS & LOGIC:
1. Teams & Score: Two teams (Team A and Team B). The scoreboard must always be visible.
2. Categories (Doors/أبواب): There are 5 categories: 
   - General Questions (الأسئلة العامة)
   - Biographies (السيرة الذاتية)
   - Letters/Words (الحروف)
   - Images/Puzzles (الصور)
   - Arabic Language (أسئلة اللغة العربية)
3. Board Layout: Each category has 6 questions in total (conceptually 3 point-value levels allocated per team, meaning 6 distinct point buttons per category on the board). 
4. Question Flow (Game Master Control):
   - The user clicks a point button from a category.
   - The Question View appears showing the question text (and image if applicable).
   - The question is open to BOTH teams in real life.
   - The user clicks a "Show Answer" (عرض الإجابة) button.
   - The Answer View shows the correct answer alongside 3 assignment buttons: 
     * "Team 1 Won" (فاز الفريق الأول) -> Adds points to Team 1.
     * "Team 2 Won" (فاز الفريق الثاني) -> Adds points to Team 2.
     * "Nobody" (لا أحد) -> No points awarded, question marked as played.
   - Return to the main board. The played button becomes disabled/grayed out.

CATEGORY SPECIFICATIONS (Mock Data structure required):
- General Questions: Text prompt -> Text answer, with optional image or mp3 audio clip.
- Biographies: An image placeholder, mp3 audio clip, or text hinting at a famous Arab/International figure -> Text answer.
- Images: Multiple image placeholders (hinting at a word, phrase, or proverb) -> Text answer.
- Arabic Language: Text questions about Arabic sciences -> Text answer.
- Letters: Standard Text -> Text answer.
(Note to developer: Create a robust JSON-like structure in JS so the user can easily replace placeholders with real images, audio, and text later).

WINNING CONDITIONS & ENDGAME:
- The primary goal is to finish all available categories with a higher score.
- Catch-up Mechanic: If a team finishes all 3 of their allocated questions in every category but their score is lower than the other team, they are allowed to continue playing by selecting from the opponent's remaining questions. 
- The game declares the final winner when all board questions are exhausted, or one team achieves an uncatchable lead based on the remaining points on the board.

UI/UX CONSTRAINTS:
- Flat design (No heavy CSS gradients).
- Dark theme (Slightly dark background, contrasting clean cards/buttons).
- Typography: Arabic Google Fonts (e.g., Cairo or Tajawal).
- Layout: RTL (Right-to-Left) direction everywhere.
- Modals/Popups: Use smooth modals for Question and Answer views rather than navigating to different HTML pages, ensuring a seamless App-like feel.

Please start the multi-agent process, generate the mock data structure first, and then output the full code files.
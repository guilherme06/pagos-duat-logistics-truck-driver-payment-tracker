# Pagos Duat Logistics   Truck Driver Payment Tracker

## Overview
A payment tracking application for truck drivers to monitor monthly trip progress and earnings, with multilingual support (Spanish, Portuguese, English) and customizable company branding.

## Core Features

### User Setup
- On first login, prompt user to enter their name
- Display "Nombre de tu empresa" as the main title instead of "Duat logísticas" or any default company name
- Prompt user to enter their company name for application personalization with clearly visible and editable field
- Ensure header and other important app areas do not display "Duat logísticas" until user has entered their own company name
- Set default currency to Euro (€)
- Request fixed monthly salary amount (editable later)
- Request monthly financial goal (objetivo mensual) amount (editable later)
- Initial login screen should not display any hero image at the top

### Profile Configuration
- Users can access configuration section to edit their profile
- Profile fields (name, company name, fixed monthly salary, and monthly financial goal) display in read-only mode by default
- When user clicks "Editar Perfil" button, fields become editable without triggering any save operation
- In edit mode, users can modify name, company name, salary fields, and monthly financial goal
- When editing salary, include date selector (month and year) to specify when the new salary becomes effective
- Monthly financial goal can be edited at any time and applies to current and future months
- Display calculated annual goal automatically based on monthly goal (monthly goal × 12)
- The "Guardar Cambios" (Save Changes) and "Cancelar" (Cancel) buttons must be positioned at the bottom of the profile settings form, replacing the position of the "Editar Perfil" button
- The "Guardar Cambios" button must use the primary orange or blue color with high contrast text for excellent visibility in both light and dark modes
- The "Cancelar" button must use a red background with white text for clear visibility and distinction in both light and dark modes
- Changes are only saved to backend when user explicitly clicks "Guardar Cambios" button
- Include proper validation for salary field (must be positive number), monthly goal field (must be positive number), and company name (cannot be empty)
- Display error messages for invalid inputs in the selected language
- After successful save, return to read-only display mode showing updated values
- If user navigates away or cancels without saving, discard all unsaved changes
- Updated salary should immediately reflect in monthly overview calculations based on the effective date after successful save
- Updated company name should immediately reflect in application header and relevant areas after successful save
- Updated monthly goal should immediately reflect in monthly overview and summary calculations

### Application Branding
- Display user's company name in the application header
- Show company name in relevant areas throughout the application
- Replace default application name with user's custom company name
- Ensure company name updates are reflected immediately across all application areas

### PWA Configuration
- Configure Progressive Web App (PWA) using the provided user icon "9561d64f-95a0-40e3-80a4-ee5a431ab632.png" as the main app icon
- Use this icon for all PWA shortcuts, home screen display, splash screen, and manifest references
- Maintain the original icon background and styling as provided by the user
- Ensure icon provides excellent visibility and professional appearance in both light and dark mobile themes
- Update all PWA manifest references to use the new user-provided icon
- Replace any previous shortcut icons with the new user-provided icon in PWA manifest

### Sticky Header with Scroll Animation
- Implement a responsive header that shrinks when user scrolls down
- Header should transition smoothly from full size to compact size with reduced height and font size
- Company name must remain clearly readable in both light and dark modes during all scroll states
- Header should stick to the top of the page when scrolling
- Animation should be smooth and visually appealing
- Ensure proper contrast and visibility of company name text in both expanded and compact states

### Trip Categories Management
- Allow users to create and manage reusable trip categories
- Each category includes a name (e.g., "Francia", "Lidl") and default payment amount
- Categories can be edited or deleted at any time
- Pre-populate trip logging with category payment amounts
- The "Nueva Categoría" button must use the primary orange or blue color with high contrast text for excellent visibility in both light and dark modes
- The "Crear" button in category creation forms must use the primary orange or blue color with high contrast text
- The "Cancelar" button in category forms must use a red background with white text for clear visibility and distinction

### Trip Logging
- Users can log individual trips by selecting from existing categories
- Include large, modern, visually distinct calendar component for date selection, allowing users to choose the trip date instead of defaulting to current date
- Allow manual entry/editing of payment amount for each trip
- Display running total of monthly earnings from trips
- Support multiple trip entries per day and category without ID conflicts
- The "Registrar" button for trip logging must use the primary orange or blue color with high contrast text for excellent visibility in both light and dark modes
- The "Cancelar" button in trip forms must use a red background with white text for clear visibility and distinction

### Trip Editing
- Each trip entry in the "Viajes" section must display an edit option (button or icon) that is clearly accessible
- When editing a trip, users can modify the category, payment amount, and date
- Trip editing uses the same calendar component as trip creation for date selection
- Changes to trip records are saved immediately when user confirms the edit
- Updated trip information reflects immediately in monthly totals and displays
- The "Guardar" button for trip editing must use the primary orange or blue color with high contrast text
- The "Cancelar" button in trip editing must use a red background with white text

### Other Income/Expenses ("Otros")
- Dedicated section for miscellaneous monthly income or expenses
- Allow users to register unlimited entries without any quantity restrictions
- Include large, modern, visually distinct calendar component for date selection, allowing users to choose the date instead of defaulting to current date
- Include toggle or button selection for entry type: "crédito" (income) or "deuda" (expense)
- When "Crédito" is selected, the button background must be green with high contrast text for excellent visibility in both light and dark modes, matching the visual prominence of the red background for "Deuda"
- Support both positive (income) and negative (expense) amounts based on selected type
- Include description field for each entry
- Support multiple entries per day without ID conflicts
- All "crédito" entries must display with green background applied to the entire entry row/card in the entry list, ensuring consistent green color visibility equal to the red color used for "deuda" entries in both light and dark modes
- Green background for "crédito" entries must be applied to the complete entry row/card consistently across all display areas including entry lists, summaries, and any other locations where these entries are shown
- The "Guardar" button for otros entries must use the primary orange or blue color with high contrast text for excellent visibility in both light and dark modes
- The "Cancelar" button in otros forms must use a red background with white text for clear visibility and distinction

### Other Entries Editing
- Each entry in the "Otros" section must display an edit option (button or icon) that is clearly accessible
- When editing an "otros" entry, users can modify the description, amount, date, and entry type (crédito/deuda)
- Entry editing uses the same calendar component as entry creation for date selection
- Changes to "otros" entries are saved immediately when user confirms the edit
- Updated entry information reflects immediately in monthly totals and displays
- The "Guardar" button for otros editing must use the primary orange or blue color with high contrast text
- The "Cancelar" button in otros editing must use a red background with white text
- Entry type changes (crédito/deuda) update the visual styling immediately after save

### Monthly Overview
- Display current month's total earnings (salary + trips + otros)
- Calculate salary amount based on effective date of salary changes for the selected month
- Show breakdown of earnings by category
- Display monthly financial goal and progress toward achieving it
- Show visual indicator of goal achievement status (achieved, in progress, exceeded)
- Reset monthly totals automatically each month

### History and Export
- View historical records of all trips and payments
- Enhanced Excel/CSV export functionality with improved formatting and visual appeal
- Export includes clearer column headers, larger and more colorful numbers, and improved formatting for totals and categories
- Export data is formatted to be visually appealing and user-friendly with proper styling for financial amounts
- Filter history by month/date ranges
- Display monthly summary breakdown within the "Historial" view showing counts and totals grouped by category and entry type
- Summary shows trip counts by category (e.g., "Viajes Burdeos: 6", "Viajes Lidl Corto: 4") and otros entries with totals (e.g., "Extras: -150")
- Summary breakdown updates dynamically based on selected month filter

### Monthly Summary Image Generation
- Generate visually attractive summary image when exporting monthly history with modern, celebratory design
- Image displays user's name, company name, selected month, total to receive, expenses, and net balance using large, colorful numbers
- Display monthly financial goal and achievement status prominently with visual celebration elements
- Include achievement badges, medals, or trophy icons when monthly goal is achieved or exceeded
- Show motivational messages based on goal achievement: "¡Objetivo logrado!" (goal achieved), "Sigue así, vas por buen camino" (on track), "¡Este mes superaste tu meta!" (exceeded goal)
- Use vibrant color scheme with blue, green, and golden colors for modern, attractive design
- Include eye-catching typography with large, bold numbers for financial amounts
- Add celebration visual effects like confetti, sparkles, or burst patterns when goal is achieved or exceeded
- Include professional achievement icons (trophies, medals, ribbons, badges) to enhance celebratory feel
- Display clear visual distinction between goal achieved, exceeded, or in progress states
- Include randomly selected positive phrase from options like: "Este es mi resumen mensual", "Esto es lo que me toca percibir este mes", "Este mes [nombre de la empresa] me tiene que pagar tanto"
- **MANDATORY Trip Category Breakdown Display**: The trip category breakdown MUST be prominently displayed in every generated summary image, showing each category name with its trip count (e.g., "Viajes Burdeos: 6", "Viajes Lidl largo: 4", "Viajes Francia: 2") using large, colorful, modern typography that is easily readable and visually prominent
- **Guaranteed Category Visibility**: The trip category breakdown must be positioned prominently in the image layout, ensuring it is one of the most visible elements alongside financial totals and motivational messages
- **Large Typography for Categories**: Use large, bold, colorful typography for the trip category breakdown that matches or exceeds the visual prominence of financial amounts in the image
- **Modern Visual Design**: Apply modern, attractive visual styling to the category breakdown section with vibrant colors, proper spacing, and clear visual hierarchy
- **Complete Category Integration**: Integrate the trip category breakdown seamlessly into the overall image design while maintaining its visual prominence and readability
- Design should convey accomplishment and celebration, making users feel proud of their achievements
- Provide easy sharing and download options for the generated image
- Image generation happens in the frontend using canvas or similar technology
- **Robust Error Handling**: The image generation system must never display only an error message but always generate an attractive image, even with incomplete or unexpected data
- **Fallback Data Handling**: When data is missing or incomplete, display clear default messages or placeholder values (e.g., "Sin datos disponibles", "0 €", "Mes no especificado")
- **Graceful Degradation**: If specific data points are unavailable, the image should still generate with available information and appropriate fallback text
- **Default Image Generation**: Even in cases of complete data absence, generate a motivational default image with company branding and encouraging messages
- **Error Recovery**: Handle all potential data errors silently in the background while presenting a professional, visually appealing result to the user

### On-Screen Monthly Summary Display
- **MANDATORY Trip Category Breakdown Display**: Display the detailed trip category breakdown prominently in every on-screen monthly summary view, showing trip counts by category using large, colorful, modern typography that is easily readable and visually prominent
- **Guaranteed Category Visibility**: Position the trip category breakdown as one of the most visible elements in the on-screen summary, ensuring it receives equal or greater visual prominence than other financial information
- **Large Typography for Categories**: Use large, bold, colorful typography for the trip category breakdown that is consistent with the app's modern design and provides excellent readability
- **Modern Visual Integration**: Present the category breakdown with modern, attractive visual styling that integrates seamlessly with the overall summary design while maintaining its prominence
- **Dynamic Updates**: Update category breakdown dynamically and immediately when monthly data changes, ensuring real-time accuracy
- **Visual Consistency**: Ensure complete visual consistency between on-screen summary and generated image summary for trip category breakdown display

### Data Management
- All user data is editable: name, company name, salary, monthly financial goal, categories, trip records, and otros entries
- Data persistence across sessions
- Backend storage of user profiles, trip categories, trip logs, and otros entries

### Multilingual Support
- Support for three languages: Spanish, Portuguese, and English
- Language selector available in main navigation or settings
- All UI text, labels, buttons, error messages, and user-facing content available in all three languages
- User's selected language preference is saved and persists across sessions
- Default language is Spanish
- Language changes apply immediately throughout the application
- When user selects a language from the language selector, all application content must update instantly to the selected language without requiring page refresh or navigation
- Language switching must work correctly in both light and dark modes
- All sections, forms, buttons, navigation elements, and dynamic content must reflect the language change immediately
- Ensure proper language synchronization across all application components and states

### UI/UX Features
- Primary color scheme using orange, blue, and green colors throughout the application, completely removing any previous corporate colors
- Update Tailwind color palette and global styles to reflect the new orange, blue, and green color scheme across all main components (buttons, header, backgrounds, accents, etc.)
- All primary action buttons (Registrar, Crear, Guardar Cambios, Nueva Categoría, Guardar, etc.) must use a consistent color scheme with the primary orange or blue color and high contrast text for excellent visibility in both light and dark modes
- All "Cancelar" (Cancel) buttons must use a red background with white text for clear visibility and distinction in both light and dark modes
- Apply consistent button styling across all forms and dialogs including categorías, viajes, otros, and perfil sections
- Remove all small logos from header and any other locations where they appear for a cleaner, more modern interface
- Apply modern and attractive visual design infrastructure while maintaining the existing structure but modernizing visual details (borders, shadows, backgrounds, iconography, and typography as needed)
- Dark mode toggle allowing users to switch between light and dark themes
- Modern, user-friendly calendar components in both "Viajes" and "Otros" sections
- Responsive design optimized for mobile and desktop use
- All application content and interface elements displayed in the user's selected language

## Backend Requirements
- Store user profiles (name, company name, salary, currency settings, monthly financial goal)
- Store user language preference and provide language-specific content
- Store salary history with effective dates (month and year) to track salary changes over time
- Store monthly financial goal and calculate annual goal automatically
- Provide secure update endpoint for profile modifications that only saves when explicitly requested
- Implement proper validation for profile updates (salary must be positive number, monthly goal must be positive number, name and company name cannot be empty)
- Return validation errors in the user's selected language for frontend display
- Ensure profile changes are atomic - either all fields update successfully or none do
- Calculate correct salary amount for any given month based on salary history and effective dates
- Calculate goal achievement status by comparing monthly totals against monthly financial goal
- Persist trip categories with names and default amounts
- Save individual trip records with user-selected dates, categories, and payment amounts
- **Enhanced Trip Record ID Generation**: Generate unique identifiers for trip records that include additional components (timestamp, counter, or UUID) to prevent ID collisions when multiple trips are registered on the same date and category
- **Collision-Free Trip Storage**: Ensure multiple trip entries can be saved for the same date and category without overwriting existing records
- Provide update endpoints for modifying existing trip records (category, amount, date)
- Store "otros" entries with user-selected dates, descriptions and amounts
- **Enhanced Otros Entry ID Generation**: Generate unique identifiers for otros entries that include additional components (timestamp, counter, or UUID) to prevent ID collisions when multiple entries are registered on the same date
- **Collision-Free Otros Storage**: Ensure multiple otros entries can be saved for the same date without overwriting existing records
- Provide update endpoints for modifying existing "otros" entries (description, amount, date, entry type)
- **Robust Entry Retrieval**: Ensure all trip records and otros entries are correctly retrieved and displayed in chronological order, regardless of how many entries exist for the same date
- **Data Integrity Verification**: Implement validation to ensure entries like "Lidl cs 90€" are properly saved and retrieved without data corruption or loss
- Maintain historical data for export functionality
- Provide enhanced export data formatting with structured information for improved Excel/CSV generation
- Generate monthly summary breakdown data grouped by category and entry type for historial view
- Summary shows trip counts by category (e.g., "Viajes Burdeos: 6", "Viajes Lidl Corto: 4") and otros entries with totals (e.g., "Extras: -150")
- **MANDATORY Trip Category Breakdown Data**: Provide comprehensive and complete trip category breakdown data including category names and their respective trip counts for the selected month, ensuring this data is always available and never missing
- **Guaranteed Category Count Calculations**: Calculate and return accurate trip counts for each category used within the specified month period, with proper handling of edge cases and data validation
- **Structured Category Data for Visual Display**: Return trip category breakdown in a structured, reliable format specifically optimized for both on-screen display and image generation with consistent data structure
- **Enhanced Data Reliability**: Ensure trip category breakdown data is always complete, accurate, and immediately available for frontend consumption without delays or missing information
- Summary breakdown updates dynamically based on selected month periods
- Provide endpoints to retrieve categorized counts and totals for selected month periods
- Calculate and return trip counts by category and otros totals for summary display
- Provide multilingual text content and translations for all UI elements in Spanish, Portuguese, and English
- Ensure language preference updates are saved immediately when user changes language selection
- Provide endpoints that return all translatable content in the requested language for immediate frontend updates
- Support real-time language switching without requiring backend session refresh or user re-authentication
- Store collection of positive phrases for monthly summary image generation in Spanish
- Store collection of motivational messages for goal achievement status in Spanish
- Provide endpoint to retrieve random phrase for image generation
- Provide endpoint to retrieve appropriate motivational message based on goal achievement status
- **Robust Data Validation for Image Generation**: Provide fallback data and default values for image generation when user data is incomplete or missing
- **Error-Resilient Data Endpoints**: Ensure all data endpoints for image generation return valid, usable data even when user profiles or monthly data are incomplete
- **Default Content Provision**: Supply default motivational phrases, company names, and financial values when user-specific data is unavailable
- **Graceful Data Handling**: Handle missing or corrupted data gracefully by providing sensible defaults rather than error responses for image generation requests

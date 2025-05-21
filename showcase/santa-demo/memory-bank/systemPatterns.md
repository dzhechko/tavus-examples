# System Patterns

## State Management
- Jotai is used for state management across the application
- Screen state is managed through the screenAtom in the store directory
- Conversation state manages interaction with the Tavus API

## Component Structure
- Screen Components: Each screen is a separate component in the screens directory
- UI Components: Reusable UI elements in the components directory
- Layout Components: Header and Footer components for consistent layout

## API Patterns
- API functions are isolated in the api directory
- Each API function handles a specific operation (create conversation, end conversation, health check)
- Error handling pattern includes response status checking

## User Interface Patterns
- Responsive design for different device sizes
- Holiday-themed styling with snow animation
- Consistent header and footer across screens
- Background audio for immersive experience

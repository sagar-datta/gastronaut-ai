# Gastronaut AI 🍳

A sophisticated AI-powered recipe generator built with React, TypeScript, and Google's Gemini Pro API. This application showcases modern web development practices, responsive design, and thoughtful UX decisions to create a seamless cooking experience.

## ✨ Key Technical Highlights

### 💡 Smart Architecture
- **Component Composition**: Modular architecture with specialized components (RecipeInputForm, RecipeDisplay, etc.) for maintainability and reusability
- **TypeScript Integration**: Comprehensive type safety with interfaces for props and state management
- **Performance Optimization**: 
  - Efficient state management with React hooks
  - Memoized computations using `useMemo` for expensive operations
  - Lazy loading and code splitting for optimal bundle size

### 🎯 Advanced UI/UX Features
- **Responsive Design**:
  - Fluid layouts using CSS Grid and Flexbox
  - Mobile-first approach with responsive breakpoints
  - Smart scrolling behavior on mobile devices
  - Touch-friendly interactive elements

- **Smooth Animations**:
  - Framer Motion integration for fluid transitions
  - Collapsible sections with smooth height animations
  - Micro-interactions for better user feedback
  - Optimized animation performance with GPU acceleration

- **Print Optimization**:
  - Custom print styles for recipe cards
  - Smart page breaks to prevent split content
  - Printer-friendly formatting with proper spacing
  - Automatic bullet points and formatting conversion

- **Accessibility**:
  - ARIA labels and roles for screen readers
  - Keyboard navigation support
  - High contrast ratios for better readability
  - Semantic HTML structure

### 🛠 Smart Features
- **Intelligent Form Design**:
  - Collapsible optional settings to reduce cognitive load
  - Real-time validation and feedback
  - Smart defaults based on user context
  - Persistent state management

- **Recipe Management**:
  - Interactive checklist for ingredients and equipment
  - State persistence for checked items
  - Smart section organization
  - Markdown rendering with custom components

- **User Experience Optimizations**:
  - Smooth scrolling to recipe display on mobile
  - Loading states with skeleton screens
  - Error handling with user-friendly messages
  - Responsive textarea inputs with auto-resize

## 🚀 Quick Start

Visit [sagar-datta.github.io/gastronaut-ai](https://sagar-datta.github.io/gastronaut-ai/) to start generating recipes!

### Local Development

```bash
# Clone the repository
git clone https://github.com/sagar-datta/gastronaut-ai.git

# Install dependencies
npm install

# Set up environment variable
VITE_GOOGLE_API_KEY=your_gemini_api_key

# Start development server
npm run dev
```

## 🔧 Technical Stack

### Frontend Core
- **React 18**: Latest features including automatic batching and concurrent rendering
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Lightning-fast HMR and optimized build process

### UI Framework
- **Tailwind CSS**: 
  - Utility-first CSS framework
  - Custom configuration for brand colors
  - JIT compiler for optimized production builds
- **Shadcn/ui**: 
  - Accessible component primitives
  - Customizable design system
  - Radix UI integration for better accessibility
- **Framer Motion**: 
  - Production-ready animations
  - GPU-accelerated transitions
  - Gesture support

### AI Integration
- **Google's Gemini Pro API**: 
  - State-of-the-art language model
  - Context-aware recipe generation
  - Natural language processing

## 📱 Mobile Support
- Responsive design that adapts to any screen size
- Touch-optimized interactions
- Mobile-specific UX enhancements:
  - Automatic scrolling to relevant sections
  - Touch-friendly input controls
  - Optimized layout for smaller screens

## 🎨 UX Decisions
- **Progressive Disclosure**: Optional settings hidden behind a collapsible section to reduce initial complexity
- **Smart Defaults**: Reasonable default values for all inputs
- **Visual Feedback**: Loading states, animations, and micro-interactions for better user engagement
- **Error Prevention**: Input validation and clear error messages
- **Accessibility First**: Screen reader support and keyboard navigation
- **Print Optimization**: Clean, properly formatted recipe printouts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## ❓ Troubleshooting

- **API Key Issues**: Ensure your Gemini API key is properly set in the environment variables
- **Build Errors**: Make sure all dependencies are installed with `npm install`
- **Generation Fails**: Check your internet connection and API key validity

# Gastronaut AI 🍳

A modern recipe generation application that leverages AI to create personalized recipes based on available ingredients and user preferences.

## Try It Out

🚀 **Live Demo**: [sagar-datta.github.io/gastronaut-ai](https://sagar-datta.github.io/gastronaut-ai/)

Test the application by providing your ingredients and preferences to generate custom recipes in real-time.

## Core Features

- **Smart Recipe Generation**: Algorithmic recipe creation from user-provided ingredients
- **Adaptive Difficulty**: Dynamic recipe complexity based on user experience level
- **Time Optimization**: Recipe generation within specified time constraints
- **Dietary Specifications**: Support for various dietary requirements and restrictions
- **Equipment Adaptation**: Recipe methods tailored to available kitchen equipment
- **Print Integration**: Optimized recipe formatting for printing
- **Responsive Interface**: Full mobile and desktop browser support

## Technical Stack

### Frontend Architecture

- **React 18** with **TypeScript** for type-safe development
- **Vite** as the build tool and development server
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** for component architecture
- **Radix UI** for accessible primitive components
- **Framer Motion** for UI animations

### AI Implementation

- **Google's Gemini Pro** API integration
- Custom prompt engineering for recipe generation

### Core Dependencies

- `@radix-ui` for foundational UI components
- `class-variance-authority` for component variant management
- `clsx` and `tailwind-merge` for class name handling
- `lucide-react` for iconography
- `react-markdown` for recipe text processing

## Development Setup

1. Clone the repository

```bash
git clone https://github.com/sagar-datta/gastronaut-ai.git
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

4. Launch development server

```bash
npm run dev
```

## License

This project is distributed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Gastronaut AI 🍳

An AI-powered culinary companion that generates personalized recipes based on your available ingredients, cooking experience, and dietary preferences.

## Features

- **Ingredient-Based Recipe Generation**: Input your available ingredients and get custom recipes
- **Experience Level Adaptation**: Recipes tailored to your cooking expertise (Beginner, Home Chef, or Professional)
- **Time Management**: Set your available cooking time and get recipes that fit your schedule
- **Dietary Customization**: Specify dietary goals, restrictions, and cuisine preferences
- **Equipment Consideration**: Recipes adapted to your available kitchen equipment
- **Print-Friendly**: Easy recipe printing functionality
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Technology Stack

### Frontend

- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations

### AI Integration

- **Google's Gemini Pro** for recipe generation
- Custom prompt engineering for culinary expertise

### Key Libraries

- `@radix-ui` for foundational components
- `class-variance-authority` for component variants
- `clsx` and `tailwind-merge` for class management
- `lucide-react` for icons
- `react-markdown` for recipe formatting

## Getting Started

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

4. Start the development server

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F8FA',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C2B4A',
          light: '#2E4470',
        },
        accent: {
          DEFAULT: '#2F7B6B',
          light: '#E6F0ED',
        },
        overdue: {
          DEFAULT: '#B3261E',
          light: '#FBEAE9',
        },
        slate: {
          DEFAULT: '#5B6472',
          light: '#EDEFF2',
        },
        border: '#E2E5EA',
      },
      fontFamily: {
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
};

export default config;

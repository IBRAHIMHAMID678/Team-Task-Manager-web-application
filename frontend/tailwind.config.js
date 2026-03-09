/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        darkBg: '#131315',
        cardBg: '#1A1C1E',
        inputBg: '#212225',
        borderColor: '#2A2B2F',
        brandLime: '#A6F516',
        brandLimeHover: '#92DE10',
        textMuted: '#8B8C90',
        textMutedDark: '#6A6B70',
        statusToDo: '#5E5F64', // Dark gray/white mixture
        statusProgress: '#00E1D9', // Cyan
        statusDone: '#A6F516', // Lime
        priorityHigh: '#F97316', // Orange
        priorityMedium: '#EAB308', // Yellow
        priorityLow: '#6B7280', // Gray
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(166, 245, 22, 0.4)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #242426 1px, transparent 1px), linear-gradient(to bottom, #242426 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}

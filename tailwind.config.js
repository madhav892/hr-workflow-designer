/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Node type colors
        'node-start': '#10b981',
        'node-task': '#3b82f6',
        'node-approval': '#f59e0b',
        'node-automated': '#8b5cf6',
        'node-end': '#ef4444',
      },
    },
  },
  plugins: [],
}

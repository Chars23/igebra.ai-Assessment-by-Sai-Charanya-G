/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo
        accent: '#f59e42', // Orange
        background: '#f8fafc', // Light gray
        card: '#ffffff',
        text: '#1e293b', // Slate
        subtle: '#64748b', // Subtle text
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(99,102,241,0.08)',
      },
    },
  },
  plugins: [],
};

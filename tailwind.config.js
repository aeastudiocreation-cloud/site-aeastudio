/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
      extend: {
          colors: {
              brand: {
                  purple: '#4a154b',
                  'purple-dark': '#2b0f3d',
                  'purple-light': '#7c2d7e',
                  gold: '#d8b772',
                  'gold-dark': '#c5a059',
                  'gold-light': '#f5dfa3',
              },
              surface: {
                  DEFAULT: '#F9FAFB',
                  white: '#FFFFFF',
                  cream: '#fdfaf3',
                  lavender: '#f8f5fa',
              },
              txt: {
                  DEFAULT: '#111827',
                  secondary: '#4B5563',
                  muted: '#6B7280',
              }
          },
          fontFamily: {
              heading: ['Outfit', 'sans-serif'],
              body: ['Inter', 'sans-serif'],
          },
          borderRadius: {
              'card': '15px',
          },
          boxShadow: {
              'card': '0 0 60px rgba(0, 0, 0, 0.08)',
              'card-hover': '0 20px 60px rgba(74, 21, 75, 0.12)',
              'soft': '0 4px 30px rgba(0, 0, 0, 0.06)',
          }
      }
  },
  plugins: [],
}

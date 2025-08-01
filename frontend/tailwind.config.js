/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'rd-blue': 'var(--rd-blue)',
        'rd-blue-dark': 'var(--rd-blue-dark)',
        'rd-blue-light': 'var(--rd-blue-light)',
        'rd-cyan': 'var(--rd-cyan)',
        'rd-cyan-light': 'var(--rd-cyan-light)',
        'rd-sky': 'var(--rd-sky)',
        'rd-sky-light': 'var(--rd-sky-light)',
        'rd-gray': 'var(--rd-gray)',
        'rd-gray-light': 'var(--rd-gray-light)',
        'rd-white': 'var(--rd-white)',
        'rd-red': 'var(--rd-red)',
        'rd-yellow': 'var(--rd-yellow)',
        'rd-green': 'var(--rd-green)',
        'rd-overlay': 'var(--rd-overlay)',
      },
    },
  },
  plugins: [],
};

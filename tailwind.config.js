/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Times New Roman"', 'Times', 'serif'],
                sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
            },
            colors: {
                'paper': '#f4f1ea',
                'ink': '#2c2c2c',
                'sepia-dark': '#5c4b37',
                'sepia-light': '#dcd6c9',
            }
        },
    },
    plugins: [],
}

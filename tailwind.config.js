/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // This ensures all your JSX files are scanned
    ],
    theme: {
        extend: {
            colors: {
                // Adding your brand colors for easier use
                brand: '#ccff00',
                dark: '#0a0a0a',
                earth: '#FDFBF7',
            },
        },
    },
    plugins: [],
}
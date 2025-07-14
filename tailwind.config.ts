/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/screen/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            animation: {
                shimmer: "shimmer 2s linear infinite",
            },
            keyframes: {
                shimmer: {
                    from: {
                        backgroundPosition: "0 0",
                    },
                    to: {
                        backgroundPosition: "-200% 0",
                    },
                },
            },
            fontFamily: {
                sans: ['"Winky Rough"', "sans-serif"],
            },
        },
    },
    plugins: [],
};

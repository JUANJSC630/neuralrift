// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
        "./resources/js/**/*.ts",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                nr: {
                    // Backgrounds
                    bg: "#080B12",
                    bg2: "#090c14",
                    bg3: "#070a11",
                    surface: "#111827",
                    // Accents
                    accent: "#7C6AF7",
                    "accent-dark": "#6d58f0",
                    cyan: "#06B6D4",
                    gold: "#F59E0B",
                    green: "#10B981",
                    red: "#EF4444",
                    pink: "#EC4899",
                    orange: "#F97316",
                    // Text
                    text: "#F1F5F9",
                    muted: "#94A3B8",
                    faint: "#6B7280",
                    // Glows (para box-shadow)
                    glow: "rgba(124,106,247,0.28)",
                    "glow-cyan": "rgba(6,182,212,0.22)",
                },
            },
            fontFamily: {
                display: ['"Playfair Display"', 'Georgia', ...defaultTheme.fontFamily.serif],
                sans: ['"DM Sans"', 'system-ui', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            borderRadius: {
                xl2: "20px",
                xl3: "28px",
            },
            backdropBlur: {
                xs: "4px",
            },
            animation: {
                "glow-pulse": "glowPulse 3s ease-in-out infinite",
                float: "float 4s ease-in-out infinite",
                "grad-border": "gradBorder 4s linear infinite",
                "fade-up": "fadeUp 0.5s ease both",
                blink: "blink 1s step-end infinite",
            },
            keyframes: {
                glowPulse: {
                    "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
                    "50%": { opacity: "1", transform: "scale(1.1)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                gradBorder: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
                fadeUp: {
                    from: { opacity: "0", transform: "translateY(14px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

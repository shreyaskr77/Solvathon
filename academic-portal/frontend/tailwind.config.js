export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        'apple-bg': '#f5f5f7',
        'apple-light': '#ffffff',
        'apple-gray': '#86868b',
        'apple-text': '#1d1d1f',
        'system-blue': '#0071e3',
        'system-blue-hover': '#0077ed',
      },
      spacing: {
        'apple-sm': '6px',
        'apple-md': '12px',
        'apple-lg': '20px',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'apple-md': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        'apple-lg': '12px',
        'apple-xl': '18px',
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

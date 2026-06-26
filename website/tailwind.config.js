/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080a10',
        brand: {
          DEFAULT: '#7c6cff',
          soft: '#9d90ff',
          deep: '#5b48e0'
        }
      },
      fontFamily: {
        sans: [
          '"Inter"',
          'system-ui',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif'
        ]
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}

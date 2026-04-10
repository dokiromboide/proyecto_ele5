/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ===== PALETA OFICIAL UNIMAYOR — AZUL OSCURO + AMARILLO =====
        unimayor: {
          // Azul oscuro institucional (sidebar, headers, elementos principales)
          green: {
            50:  '#E8EEF4',
            100: '#C5D3E3',
            200: '#9BB4CC',
            300: '#6A8FAF',
            400: '#2D5A8E',
            500: '#1B3A5C',   // Azul principal Unimayor
            600: '#152E4A',   // Azul oscuro Unimayor
            700: '#0F2238',
            800: '#091727',
            900: '#040C14',
          },
          // Amarillo institucional (acentos, botones, highlights)
          gold: '#F2C700',
          yellow: {
            50:  '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F2C700',   // Amarillo principal Unimayor
            600: '#D4A800',
            700: '#A67F00',
            800: '#7A5D00',
            900: '#523E00',
          },
          white: '#FFFFFF',
          gray: {
            100: '#F5F5F5',
            200: '#EEEEEE',
            700: '#616161',
            900: '#212121',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Gradiente azul oscuro institucional
        'unimayor-gradient': 'linear-gradient(135deg, #0F2238 0%, #1B3A5C 55%, #2D5A8E 100%)',
      }
    },
  },
  plugins: [],
}

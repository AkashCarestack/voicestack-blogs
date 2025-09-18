/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 

    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		
			fontFamily: {
				// 'sans': ['var(--font-inter)','sans-serif'],
				'geist': ['var(--font-geist-sans)','sans-serif'],
				'manrope': ['var(--font-manrope)', 'system-ui', 'sans-serif'],
			},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
				'vs-blue': '#4A3CE1',
				'vs-blue-secondary': '#5342FF',
				'vs-purple': '#4a3ce1',
				'vs-lemon-green': '#B5EB92',
  		},
  		animation: {
  			'shiny-text': 'shiny-text 8s infinite',
				pullUp: 'pullUp 0.3s ease-in forwards',
  		},
  		keyframes: {
  			'shiny-text': {
  				'0%, 90%, 100%': {
  					'background-position': 'calc(-100% - var(--shiny-width)) 0'
  				},
  				'30%, 60%': {
  					'background-position': 'calc(100% + var(--shiny-width)) 0'
  				}
  			},
				pullUp: {
          '0%': { transform: 'translateY(10%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
  		},
			
			backgroundImage: {
			'hero-pattern': "url('/hero-background.webp')",
			'grid-pattern': "url('/about-us.webp')",
			},
			spacing: {
        'lg': '130px',
				'md': '96px',
				'sm': '64px',
				'xs': '48px' 
      },
			maxWidth: {
        '7xl': '1240px', // Define a custom max-width value
      },
			screens: {
        'md-maxh-800': {'raw': '(min-width: 768px) and (max-height: 800px)'},
        'md-maxh-700': {'raw': '(min-width: 768px) and (max-height: 700px)'},
        'maxh-600': {'raw': '(max-height: 600px)'},
      },
			
			backgroundImage: {
			'hero-pattern': "url('/hero-background.webp')",
			'grid-pattern': "url('/about-us.webp')",
			},
			spacing: {
        'lg': '130px',
				'md': '96px',
				'sm': '64px',
				'xs': '48px' 
      },
			maxWidth: {
        '7xl': '1272px', // Define a custom max-width value
      },
	  boxShadow: {
        'custom-light': '0px 6px 20px 0px rgba(0, 0, 0, 0.05)',
      },
  	}
  },
  plugins: [require("tailwindcss-animate"),require('@tailwindcss/typography'),
  ],
}
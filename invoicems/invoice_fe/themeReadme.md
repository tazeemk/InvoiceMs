# Invoice Master Theme Colors

## Primary Gradients

### Light Green Background
```css
background: linear-gradient(135deg, #d9e9dd 0%, #bcddc4 50%, #a8cdb0 100%)
```
- **Start**: `#d9e9dd` (Light sage green)
- **Middle**: `#bcddc4` (Soft mint green)
- **End**: `#a8cdb0` (Medium sage green)

### Dark Green Sidebar/Panel
```css
background: linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)
```
- **Start**: `#13271f` (Deep forest green)
- **Middle**: `#253239` (Dark slate green)
- **End**: `#1a2e21` (Dark moss green)

## Accent Colors

### Primary Brand Color
- `#13271f` - Primary dark green (text, icons)

### Gradient Text Colors
```css
background: linear-gradient(135deg, #d9e9dd, #bcddc4, #a8cdb0)
```

### Interactive States
- **Green-100**: `#dcfce7` (Light green text)
- **Green-200**: `#bbf7d0` (Medium green text/secondary)
- **Green-300**: `#86efac` (Accent green for hover states)
- **Green-400**: `#4ade80` (Bright accent)
- **Emerald-400**: `#34d399` (Emerald accent)
- **Emerald-500**: `#10b981` (Dark emerald)

## Overlay & Effects

### White Overlays
- `rgba(255, 255, 255, 0.9)` - Primary white overlay
- `rgba(255, 255, 255, 0.7)` - Secondary white overlay
- `rgba(255, 255, 255, 0.2)` - Subtle white overlay
- `rgba(255, 255, 255, 0.1)` - Very subtle white overlay
- `rgba(255, 255, 255, 0.05)` - Minimal white overlay

### Dark Overlays
- `rgba(0, 0, 0, 0.05)` - Subtle dark overlay
- `rgba(0, 0, 0, 0.1)` - Light dark overlay
- `rgba(0, 0, 0, 0.3)` - Medium dark overlay

### Emerald/Green Overlays
- `rgba(16, 185, 129, 0.1)` - Emerald-500 with 10% opacity
- `rgba(52, 211, 153, 0.2)` - Emerald-400 with 20% opacity
- `rgba(74, 222, 128, 0.15)` - Green-400 with 15% opacity

## Border Colors

### Primary Borders
- `rgba(255, 255, 255, 0.2)` - White border for glass effect
- `rgba(255, 255, 255, 0.1)` - Subtle white border
- `rgba(255, 255, 255, 0.05)` - Minimal white border

## Text Colors

### Dark Theme (Sidebar)
- **Primary**: `text-green-100` (`#dcfce7`)
- **Secondary**: `text-green-200/60` (`#bbf7d0` with 60% opacity)
- **Muted**: `text-green-200/70` (`#bbf7d0` with 70% opacity)

### Light Theme (Main Content)
- **Primary**: `#13271f` (Dark forest green)
- **Secondary**: Various green shades for hierarchy

## Usage Examples

### CSS Variables
```css
:root {
  --primary-bg: linear-gradient(135deg, #d9e9dd 0%, #bcddc4 50%, #a8cdb0 100%);
  --dark-bg: linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%);
  --primary-text: #13271f;
  --glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  --border-glass: rgba(255, 255, 255, 0.2);
}
```

### Tailwind Custom Colors
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'sage': {
          50: '#f6f9f7',
          100: '#d9e9dd',
          200: '#bcddc4',
          300: '#a8cdb0',
          400: '#94bd9c',
          500: '#80ad88',
          600: '#6b9d74',
          700: '#578d60',
          800: '#427d4c',
          900: '#2e6d38',
        },
        'forest': {
          50: '#f0f4f1',
          100: '#d1ddd4',
          200: '#b3c6b7',
          300: '#94af9a',
          400: '#75987d',
          500: '#568160',
          600: '#426a4b',
          700: '#2e5336',
          800: '#1a3c21',
          900: '#13271f',
        }
      }
    }
  }
}

# Invoice Master Theme - Custom Usage Examples

## 1. Component Styling Patterns

### Glass Card Component
```jsx
const GlassCard = ({ children, className = "" }) => (
  <div 
    className={`backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden ${className}`}
    style={{
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
    }}
  >
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500"></div>
    {children}
  </div>
);
```

### Dark Panel Component
```jsx
const DarkPanel = ({ children, className = "" }) => (
  <div 
    className={`relative overflow-hidden ${className}`}
    style={{
      background: "linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-green-400/5"></div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);
```

### Button Variants
```jsx
// Primary Button
const PrimaryButton = ({ children, ...props }) => (
  <button 
    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
    style={{
      background: "linear-gradient(135deg, #13271f, #253239)",
      color: "#d9e9dd"
    }}
    {...props}
  >
    {children}
  </button>
);

// Secondary Button
const SecondaryButton = ({ children, ...props }) => (
  <button 
    className="px-6 py-3 rounded-xl font-semibold border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
    style={{
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      color: "#13271f"
    }}
    {...props}
  >
    {children}
  </button>
);
```

## 2. Layout Patterns

### Main App Layout
```jsx
const AppLayout = ({ children }) => (
  <div 
    className="min-h-screen"
    style={{
      background: "linear-gradient(135deg, #d9e9dd 0%, #bcddc4 50%, #a8cdb0 100%)",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5"></div>
    <div className="relative z-10 flex">
      <AppSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  </div>
);
```

### Hero Section
```jsx
const HeroSection = () => (
  <section className="relative py-20 px-8">
    <div className="text-center space-y-8">
      <h1
        className="text-5xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(135deg, #d9e9dd, #bcddc4, #a8cdb0)",
        }}
      >
        Invoice Master
      </h1>
      <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
      <p className="text-xl leading-relaxed text-green-100/90 max-w-md mx-auto">
        Transform your billing workflow with our intelligent platform
      </p>
    </div>
  </section>
);
```

## 3. Form Components

### Input Field
```jsx
const ThemeInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" style={{ color: "#13271f" }}>
      {label}
    </label>
    <input
      className="w-full px-4 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 focus:border-green-400/50 focus:outline-none"
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))",
        color: "#13271f"
      }}
      {...props}
    />
  </div>
);
```

### Select Dropdown
```jsx
const ThemeSelect = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" style={{ color: "#13271f" }}>
      {label}
    </label>
    <select
      className="w-full px-4 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 focus:border-green-400/50 focus:outline-none"
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))",
        color: "#13271f"
      }}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
```

## 4. Navigation Components

### Tab Navigation
```jsx
const TabNav = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-1 p-1 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          activeTab === tab.id 
            ? 'bg-white/20 text-green-100' 
            : 'text-green-200/70 hover:text-green-100'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
```

### Breadcrumb
```jsx
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm">
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <span className="mx-2 text-green-300">/</span>}
        <span 
          className={index === items.length - 1 ? 'text-green-100' : 'text-green-200/70'}
        >
          {item}
        </span>
      </div>
    ))}
  </nav>
);
```

## 5. Card Components

### Stats Card
```jsx
const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <div 
    className="p-6 rounded-2xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
    style={{
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div 
        className="p-3 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #13271f, #253239)",
        }}
      >
        <Icon className="w-6 h-6 text-green-100" />
      </div>
      {trend && (
        <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-green-800/70">{title}</h3>
    <p className="text-2xl font-bold" style={{ color: "#13271f" }}>{value}</p>
  </div>
);
```

### Feature Card
```jsx
const FeatureCard = ({ title, description, icon: Icon }) => (
  <div 
    className="p-8 rounded-2xl backdrop-blur-sm border border-white/20 group hover:shadow-2xl transition-all duration-500"
    style={{
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
    }}
  >
    <div className="flex justify-center mb-6">
      <div 
        className="p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(217, 233, 221, 0.9), rgba(188, 221, 196, 0.8))",
        }}
      >
        <Icon size={32} style={{ color: "#13271f" }} />
      </div>
    </div>
    <h3 className="text-xl font-bold mb-4" style={{ color: "#13271f" }}>{title}</h3>
    <p className="text-green-800/70 leading-relaxed">{description}</p>
  </div>
);
```

## 6. Utility Classes

### CSS Custom Properties
```css
:root {
  --theme-primary-bg: linear-gradient(135deg, #d9e9dd 0%, #bcddc4 50%, #a8cdb0 100%);
  --theme-dark-bg: linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%);
  --theme-glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  --theme-primary-text: #13271f;
  --theme-light-text: #d9e9dd;
  --theme-border: rgba(255, 255, 255, 0.2);
}

.theme-bg-primary { background: var(--theme-primary-bg); }
.theme-bg-dark { background: var(--theme-dark-bg); }
.theme-bg-glass { background: var(--theme-glass-bg); }
.theme-text-primary { color: var(--theme-primary-text); }
.theme-text-light { color: var(--theme-light-text); }
.theme-border { border-color: var(--theme-border); }
```

### Reusable Style Objects
```js
export const themeStyles = {
  primaryBg: "linear-gradient(135deg, #d9e9dd 0%, #bcddc4 50%, #a8cdb0 100%)",
  darkBg: "linear-gradient(135deg, #13271f 0%, #253239 50%, #1a2e21 100%)",
  glassBg: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
  primaryText: "#13271f",
  lightText: "#d9e9dd",
  border: "rgba(255, 255, 255, 0.2)",
  gradientText: "linear-gradient(135deg, #d9e9dd, #bcddc4, #a8cdb0)",
};
```

## 7. Animation Patterns

### Hover Effects
```css
.theme-hover-scale {
  transition: transform 0.3s ease;
}
.theme-hover-scale:hover {
  transform: scale(1.05);
}

.theme-glow-effect {
  position: relative;
}
.theme-glow-effect::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, #bcddc4, #d9e9dd, #bcddc4);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: -1;
  filter: blur(8px);
}
.theme-glow-effect:hover::before {
  opacity: 0.4;
}
```

### Loading States
```jsx
const ThemeSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-green-300"></div>
);

const ThemeSkeleton = ({ className = "" }) => (
  <div 
    className={`animate-pulse rounded-xl ${className}`}
    style={{ background: "rgba(255, 255, 255, 0.3)" }}
  ></div>
);
```
```
# LINCE — Sistema Tipográfico

**Versión 2.0.0** | Guía de Tipografía Completa

---

## 1. Fuentes Oficiales

### 1.1 Fuente Principal — Inter

**Inter** es la fuente sans-serif humanista de LINCE. Diseñada específicamente para pantallas digitales de alta densidad, ofrece legibilidad excepcional en todos los tamaños.

```
Fuente:    Inter (Variable Font)
Pesos:     300 (Light), 400 (Regular), 500 (Medium),
           600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)
Origen:    bunny.net (preferido, sin rastreo) / Google Fonts (alternativa)
URL bunny: https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900
URL goog:  https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900
```

**Fallbacks:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif`

### 1.2 Fuente Monoespaciada — Fira Code

**Fira Code** se usa exclusivamente para código, prompts de IA y contenido técnico. Sus ligaduras de programación mejoran la legibilidad del código.

```
Fuente:    Fira Code (Variable Font)
Pesos:     300, 400, 500, 600, 700
Ligaduras: Activadas (font-feature-settings: "liga" 1, "calt" 1)
URL:       https://fonts.bunny.net/css?family=fira-code:300,400,500,600,700
```

**Fallbacks:** `'Fira Mono', 'Cascadia Code', 'Source Code Pro', Consolas, 'Courier New', monospace`

---

## 2. Escala Tipográfica

### 2.1 Jerarquía Completa

| Nivel | CSS Class | Peso | Tamaño | Line-height | Tracking | Uso |
|---|---|---|---|---|---|---|
| **Display** | `.text-display` | 800 | 72px / 4.5rem | 1.0 | -0.02em | Héroes, portadas, splash |
| **H1** | `.text-h1` | 700 | 48px / 3rem | 1.1 | -0.015em | Títulos principales de página |
| **H2** | `.text-h2` | 700 | 36px / 2.25rem | 1.2 | -0.01em | Secciones principales |
| **H3** | `.text-h3` | 600 | 28px / 1.75rem | 1.3 | -0.005em | Subsecciones, modales |
| **H4** | `.text-h4` | 600 | 20px / 1.25rem | 1.4 | 0em | Títulos de tarjeta, sidebar |
| **Body Large** | `.text-body-lg` | 400 | 18px / 1.125rem | 1.6 | 0em | Texto introductorio, leads |
| **Body Regular** | `.text-body` | 400 | 16px / 1rem | 1.6 | 0em | Cuerpo de texto principal |
| **Body Small** | `.text-body-sm` | 400 | 14px / 0.875rem | 1.5 | 0em | Metadatos, etiquetas, ayuda |
| **Caption** | `.text-caption` | 400 | 12px / 0.75rem | 1.4 | 0.01em | Pies de foto, tooltips |
| **Mono Code** | `.text-mono` | 400 | 14px / 0.875rem | 1.5 | 0em | Código, prompts, datos técnicos |

### 2.2 Especificaciones CSS

```css
/* Display */
.text-display {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 4.5rem;       /* 72px */
  line-height: 1.0;
  letter-spacing: -0.02em;
}

/* Heading 1 */
.text-h1 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 3rem;          /* 48px */
  line-height: 1.1;
  letter-spacing: -0.015em;
}

/* Heading 2 */
.text-h2 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 2.25rem;       /* 36px */
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* Heading 3 */
.text-h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.75rem;       /* 28px */
  line-height: 1.3;
  letter-spacing: -0.005em;
}

/* Heading 4 */
.text-h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.25rem;       /* 20px */
  line-height: 1.4;
  letter-spacing: 0em;
}

/* Body Large */
.text-body-lg {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1.125rem;      /* 18px */
  line-height: 1.6;
}

/* Body Regular */
.text-body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1rem;           /* 16px */
  line-height: 1.6;
}

/* Body Small */
.text-body-sm {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.875rem;      /* 14px */
  line-height: 1.5;
}

/* Caption */
.text-caption {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;       /* 12px */
  line-height: 1.4;
  letter-spacing: 0.01em;
}

/* Mono Code */
.text-mono {
  font-family: 'Fira Code', monospace;
  font-weight: 400;
  font-size: 0.875rem;      /* 14px */
  line-height: 1.5;
  font-feature-settings: "liga" 1, "calt" 1;
}
```

---

## 3. Estilos de Texto Especiales

### 3.1 Texto en Gradiente (Brand)

```css
.text-gradient-cyan {
  background: linear-gradient(135deg, #00E5FF 0%, #0099CC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 3.2 Texto Glow (Efectos UI)

```css
.text-glow-cyan {
  color: #00E5FF;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
}

.text-glow-gold {
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}
```

### 3.3 Texto de Nivel / XP (Game UI)

```css
.text-xp {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  color: #FFD700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-level {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  color: #00E5FF;
}
```

---

## 4. Uso Responsivo

### 4.1 Escala por Breakpoint

| Nivel | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Display | 48px | 60px | 72px |
| H1 | 32px | 40px | 48px |
| H2 | 26px | 32px | 36px |
| H3 | 22px | 26px | 28px |
| H4 | 18px | 20px | 20px |
| Body L | 16px | 17px | 18px |
| Body | 15px | 16px | 16px |

### 4.2 Clamp CSS (Tipografía fluida)

```css
.text-display-fluid {
  font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);
}

.text-h1-fluid {
  font-size: clamp(1.75rem, 3vw + 1rem, 3rem);
}

.text-h2-fluid {
  font-size: clamp(1.5rem, 2.5vw + 0.75rem, 2.25rem);
}
```

---

## 5. Accesibilidad Tipográfica

### 5.1 Contraste Mínimo WCAG AA

| Tipo | Color | Fondo | Ratio | Estado |
|---|---|---|---|---|
| Cuerpo (16px+) | `#FFFFFF` | `#0A0A0A` | 21:1 | ✅ AAA |
| Secundario (16px+) | `#B0B0B0` | `#0A0A0A` | 5.3:1 | ✅ AA |
| Terciario (16px+) | `#707070` | `#0A0A0A` | 2.6:1 | ⚠️ Solo 18px+ |
| Cyan (16px+) | `#00E5FF` | `#0A0A0A` | 11.9:1 | ✅ AAA |

> **Nota**: No usar texto terciario `#707070` en tamaños inferiores a 18px para cumplir WCAG AA.

### 5.2 Tamaño Mínimo

- Texto de interfaz: mínimo **12px**
- Texto de cuerpo: mínimo **14px**
- Texto legal/notas al pie: mínimo **11px** (solo en contextos de disclaimers)

### 5.3 Interlineado Mínimo

- Párrafos de más de una línea: mínimo `line-height: 1.5`
- Textos de ayuda o tooltips: mínimo `line-height: 1.4`

---

## 6. Localización

### 6.1 Español (Idioma Principal)

- Uso correcto de tildes, ñ, comillas españolas (« »)
- Números: separador decimal coma (`,`), miles con punto (`.`)
- Fechas: DD/MM/AAAA

### 6.2 Inglés

- Fallback automático para fuente Inter (excelente soporte)

### 6.3 Chino Simplificado

- Fallback system: `'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif`
- Tamaño mínimo recomendado para texto chino: 14px

```css
:lang(zh) {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei',
               'Noto Sans SC', sans-serif;
  line-height: 1.8; /* Mayor interlineado para caracteres CJK */
}
```

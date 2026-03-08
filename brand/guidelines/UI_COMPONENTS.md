# LINCE — Biblioteca de Componentes UI

**Versión 2.0.0** | Especificaciones de Componentes

---

## 1. Botones

### 1.1 Variantes

#### Primary (Acción principal)
```
Background:   #00E5FF
Text:         #0A0A0A (contraste 11.9:1 ✅)
Border:       none
Hover bg:     #33ECFF
Active bg:    #00B8CC
Disabled bg:  #1A3A3A
Disabled text: #2A6666
```

#### Secondary (Acción secundaria)
```
Background:   transparent
Text:         #00E5FF
Border:       1px solid #00E5FF
Hover bg:     rgba(0, 229, 255, 0.1)
Active bg:    rgba(0, 229, 255, 0.2)
Disabled:     opacity 0.4
```

#### Tertiary (Acción terciaria / Ghost)
```
Background:   transparent
Text:         #B0B0B0
Border:       1px solid #333333
Hover bg:     #1A1A1A
Hover text:   #FFFFFF
Active bg:    #242424
```

#### Danger (Acción destructiva)
```
Background:   #FF3B3B
Text:         #FFFFFF
Border:       none
Hover bg:     #FF6060
Active bg:    #CC2F2F
```

#### CTA / Action (Naranja — llamadas a la acción destacadas)
```
Background:   #FF6B35
Text:         #FFFFFF
Border:       none
Hover bg:     #FF8555
Active bg:    #CC5229
Glow:         0 4px 20px rgba(255, 107, 53, 0.4)
```

### 1.2 Tamaños

| Tamaño | Padding H | Padding V | Font size | Border radius | Min width |
|---|---|---|---|---|---|
| **xs** | 12px | 6px | 12px | 6px | — |
| **sm** | 16px | 8px | 14px | 6px | — |
| **md** | 20px | 10px | 15px | 8px | 120px |
| **lg** | 24px | 12px | 16px | 10px | 160px |
| **xl** | 32px | 16px | 18px | 12px | 200px |

### 1.3 Estados

- **Default**: Estilo base
- **Hover**: Cambio de color según variante + cursor pointer
- **Focus**: `outline: 2px solid #00E5FF; outline-offset: 2px`
- **Active**: Escala `0.97` + color más oscuro
- **Loading**: Spinner animado + texto deshabilitado, `cursor: wait`
- **Disabled**: Opacidad reducida, `cursor: not-allowed`, no interactivo

### 1.4 Botón con Icono

- Icono a la izquierda del texto: gap 8px
- Icono a la derecha del texto: gap 8px
- Solo icono (icon-only): padding igual en todos lados, aria-label requerido

---

## 2. Tarjetas (Cards)

### 2.1 Card Base

```
Background:     #1A1A1A
Border:         1px solid #333333
Border radius:  12px
Padding:        24px
Shadow:         0 4px 6px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)
```

### 2.2 Card Destacada (Featured)

```
Background:     linear-gradient(135deg, #1A1A1A 0%, #111111 100%)
Border:         1px solid #00E5FF40
Border radius:  16px
Padding:        32px
Shadow:         0 0 20px rgba(0,229,255,0.1), 0 4px 6px rgba(0,0,0,0.5)
```

### 2.3 Card de Avatar / Personaje

```
Background:     #1A1A1A
Border:         2px solid #333333
Border radius:  16px
Padding:        0 (imagen top full-width) + 16px (contenido)
Hover border:   2px solid #00E5FF
Hover shadow:   0 0 20px rgba(0,229,255,0.2)
Transition:     all 300ms ease
```

### 2.4 Card de Logro (Achievement)

```
Background:     linear-gradient(135deg, #1A1200 0%, #1A1A1A 100%)
Border:         1px solid #FFD70040
Border radius:  12px
Icon area:      64x64px, fondo circular con glow dorado
```

### 2.5 Card de Estadística

```
Background:     #111111
Border:         1px solid #1E1E1E
Border radius:  8px
Padding:        16px 20px
Número:         Inter 700, 28px, #FFFFFF
Label:          Inter 400, 13px, #707070
```

---

## 3. Formularios e Inputs

### 3.1 Text Input

```
Background:    #111111
Border:        1px solid #333333
Border radius: 8px
Padding:       12px 16px
Font:          Inter 400, 16px, #FFFFFF
Placeholder:   #707070

Focus border:  1px solid #00E5FF
Focus shadow:  0 0 0 3px rgba(0,229,255,0.15)
Error border:  1px solid #FF3B3B
Error shadow:  0 0 0 3px rgba(255,59,59,0.15)
Success border: 1px solid #00D084
```

### 3.2 Select / Dropdown

```
Mismo estilo que Text Input + chevron icon derecha
Dropdown panel: background #1A1A1A, border #333333, shadow nivel 3
Item hover:     background #2A2A2A
Item selected:  background rgba(0,229,255,0.1), text #00E5FF
```

### 3.3 Checkbox

```
Size:          18x18px
Default:       border 2px solid #333333, background transparent
Checked bg:    #00E5FF
Checked mark:  #0A0A0A (check icon)
Focus:         outline 2px solid #00E5FF, offset 2px
```

### 3.4 Radio Button

```
Size:          18x18px (outer) / 8x8px (inner dot)
Default:       border 2px solid #333333, background transparent
Checked outer: border 2px solid #00E5FF
Checked inner: background #00E5FF
```

### 3.5 Toggle/Switch

```
Track width:   44px
Track height:  24px
Track off:     background #333333
Track on:      background #00E5FF
Thumb:         22px circle, background #FFFFFF
Transition:    200ms ease
```

### 3.6 Labels y Mensajes de Error

```
Label:         Inter 500, 14px, #B0B0B0, margin-bottom 6px
Helper text:   Inter 400, 12px, #707070
Error message: Inter 400, 12px, #FF3B3B, con ícono de error
Success msg:   Inter 400, 12px, #00D084, con ícono de check
Required mark: color #FF3B3B, margin-left 4px
```

---

## 4. Navegación

### 4.1 Top Bar / Header

```
Background:    rgba(10, 10, 10, 0.95), backdrop-blur 12px
Height:        64px (desktop) / 56px (mobile)
Border bottom: 1px solid #1E1E1E
Position:      fixed top 0, z-index 1000
Logo:          left, 40px altura
Nav links:     center (desktop), hidden en mobile
Actions:       right (notificaciones, perfil, XP)
```

### 4.2 Items de Navegación

```
Default:       Inter 500, 15px, #B0B0B0
Active:        Inter 600, 15px, #FFFFFF, con dot indicator #00E5FF
Hover:         color #FFFFFF
Transition:    color 200ms ease
```

### 4.3 Menú Lateral (Sidebar)

```
Background:    #0F0F0F
Width:         280px (abierto) / 0px (cerrado en mobile)
Border right:  1px solid #1E1E1E
Section items: padding 8px 16px
Section label: Inter 500, 11px, #707070, uppercase, letter-spacing 0.1em
Nav item:      Inter 500, 14px, padding 10px 16px, radius 8px
Active item:   background rgba(0,229,255,0.1), color #00E5FF,
               border-left 3px solid #00E5FF
```

### 4.4 Breadcrumbs

```
Items:         Inter 400, 14px, #707070
Separator:     "/" o "›", color #333333
Last item:     color #FFFFFF (no link)
Link hover:    color #00E5FF
```

---

## 5. Modales y Overlays

### 5.1 Modal Estándar

```
Backdrop:      rgba(0, 0, 0, 0.85), backdrop-blur 4px
Panel:         background #1A1A1A, border 1px solid #333333
               radius 16px, shadow nivel 4
Width:         480px (sm), 640px (md), 800px (lg)
Padding:       32px
Header:        título H3 + botón cerrar (top-right)
Footer:        border-top 1px solid #1E1E1E, acciones alineadas derecha
Animation:     scaleIn 200ms ease-out
```

### 5.2 Alert Dialog (Confirmación)

```
Width:         440px máximo
Icono:         48px, color semántico (warn/error)
Título:        H4, centrado
Descripción:   body, #B0B0B0, centrado
Acciones:      dos botones, cancen izquierda, confirmar derecha
Danger action: botón Danger con texto explícito
```

### 5.3 Toast / Notificación

```
Position:      top-right, 16px margen
Width:         360px
Background:    #1A1A1A, border 1px solid según tipo
Radius:        10px
Shadow:        nivel 5
Animation:     slideInRight 200ms ease-out, desvanece 5s
Tipos:         info (#00E5FF), success (#00D084),
               warning (#FFD700), error (#FF3B3B)
```

---

## 6. Badges y Pills

### 6.1 Badge Numérico

```
Min width:    20px
Height:       20px
Padding:      0 6px
Background:   #FF3B3B (notificaciones) / #00E5FF (info)
Text:         Inter 700, 11px, #0A0A0A o #FFFFFF
Radius:       9999px
Position:     absolute top-right sobre el elemento padre
```

### 6.2 Pill / Tag (Etiqueta)

```
Padding:      4px 10px
Font:         Inter 500, 12px
Radius:       9999px
Variantes:
  - Default:  bg #242424, text #B0B0B0
  - Brand:    bg rgba(0,229,255,0.15), text #00E5FF
  - Success:  bg rgba(0,208,132,0.15), text #00D084
  - Warning:  bg rgba(255,215,0,0.15), text #FFD700
  - Error:    bg rgba(255,59,59,0.15), text #FF3B3B
  - NUEVO:    bg #FF6B35, text #FFFFFF (badge nuevo)
```

### 6.3 Badge de Nivel (Game)

```
Shape:        hexágono o escudo SVG
Size:         32px (sm) / 48px (md) / 64px (lg)
Colores por nivel:
  Bronce:     #CD7F32
  Plata:      #C0C0C0
  Oro:        #FFD700
  Platino:    #E5E4E2
  Diamante:   #B9F2FF
  Élite:      radial gradient #9C27B0 → #00E5FF
```

---

## 7. Indicadores de Progreso

### 7.1 Barra de XP / Progreso

```
Track height:  8px (sm) / 12px (md) / 16px (lg)
Track bg:      #1E1E1E
Track radius:  9999px
Fill:          linear-gradient(90deg, #00E5FF, #0099CC)
Fill animated: transition width 600ms ease-out
Glow:          0 0 8px rgba(0,229,255,0.4) en el extremo del fill
```

### 7.2 Spinner de Carga

```
Size:         24px (sm) / 32px (md) / 48px (lg)
Color:        #00E5FF
Track:        rgba(0,229,255,0.2)
Animation:    spin 800ms linear infinite
```

### 7.3 Contador de Racha (Streak)

```
Icono:        🔥 con animación streakFire
Número:       Inter 800, tamaño contextual, #FF6B35
Fondo:        rgba(255,107,53,0.15), radius 8px, padding 8px 12px
```

---

## 8. Avatares (9 Personajes LINCE)

### 8.1 Especificaciones Generales

```
Estilo:       Cartoon moderno, influencia anime suave
Expresiones:  Mínimo 3 estados (neutral, feliz/celebrando, pensativo)
Animaciones:  Idle (ciclo suave), reacción positiva, negativa
Formato:      SVG (preferido) + PNG 2x como fallback
Tamaños:      64px (thumbnail), 128px (card), 256px (detalle), 512px (perfil)
```

### 8.2 Los 9 Avatares

#### 1. SABELIN — Avatar Principal
```
Paleta:       Cyan #00E5FF, negro #0A0A0A, blanco
Personalidad: Líder, guía, amigable, tecnológico
Descripción:  Avatar predeterminado. Representa la IA de LINCE.
              Diseño futurista con elementos felinos sutiles.
Uso:          Tutor principal, bienvenida, instrucciones
```

#### 2. Especialistas — Avatares Expertos
```
Paleta:       Azul técnico, gris metálico, cyan
Personalidad: Profesionales, precisos, autorizados
Descripción:  Serie de avatares de especialistas por área temática.
Uso:          Cursos técnicos, contenido avanzado
```

#### 3. MUSICALIN — Especialista Musical
```
Paleta:       Violeta #9C27B0, dorado #FFD700, rosa
Personalidad: Creativo, rítmico, expresivo, entusiasta
Descripción:  Especializado en aprendizaje de IA para música.
Uso:          Módulos de creatividad IA, generación musical
```

#### 4. ZARAGOZA — Especialista Historia/Patrimonio
```
Paleta:       Rojo Aragón #CE1126, dorado heráldico #FFD700
Personalidad: Erudito, orgulloso, narrativo, didáctico
Descripción:  Vinculado al patrimonio histórico aragonés.
Uso:          Módulos de historia, cultura, patrimonio digital
```

#### 5. ARAGONESA — Especialista Regional
```
Paleta:       Verde natural, tierra, dorado
Personalidad: Local, cercano, auténtico, inclusivo
Descripción:  Representación de la identidad aragonesa.
Uso:          Contenidos localizados, bienvenida regional
```

#### 6. OG CREW — Especialistas Comunidad
```
Paleta:       Multicolor, street style, energético
Personalidad: Urbano, colaborativo, diverso, hype
Descripción:  Equipo de avatares de la comunidad original LINCE.
Uso:          Rankings, eventos comunitarios, challenges
```

#### 7. EVENTO — Especialista de Eventos
```
Paleta:       Naranja festivo #FF6B35, blanco, negro
Personalidad: Animado, presentador, energético, festivo
Descripción:  Avatar específico para eventos y workshops.
Uso:          Live events, webinars, hackathons, workshops
```

#### 8. FAMILY — Modo Aprendizaje Familiar
```
Paleta:       Verde suave, azul amigable, amarillo cálido
Personalidad: Acogedor, seguro, inclusivo, paciente
Descripción:  Versión familiar para aprendizaje intergeneracional.
Uso:          Modo familiar, contenido para todas las edades
```

#### 9. MUSICALIN INTL — Versión Internacional
```
Paleta:       Azul internacional, dorado global
Personalidad: Global, moderno, multicultural
Descripción:  Variante internacional de MUSICALIN para mercados globales.
Uso:          Contenido en inglés/chino, contexto internacional
```

### 8.3 Estados de Avatar en UI

```
Available:    card normal, border #333333
Selected:     border 2px solid #00E5FF, glow cyan, scale 1.02
Locked:       grayscale 0.8, opacity 0.5, ícono de candado
Premium:      badge dorado en esquina, border #FFD700
New:          badge "NUEVO" naranja, animación pulse
```

---

## 9. Sistema de Iconos

### 9.1 Iconos de Interfaz (UI Icons)

```
Librería base:   Lucide React (ya en el proyecto)
Tamaños:         16px, 20px, 24px, 32px
Stroke width:    1.5px (16-20px) / 1.5px (24px+)
Color default:   currentColor (hereda del padre)
```

### 9.2 Iconos de Juego (Game Icons)

```
Tipo:         SVG custom o emoji con wrapper estilizado
XP:           ⚡ con color #00E5FF
Monedas:      🪙 con color #FFD700
Corazones/Vidas: ❤️ con color #FF3B3B
Racha:        🔥 con color #FF6B35
Estrella/Rating: ⭐ con color #FFD700
Trofeo:       🏆 con color #FFD700
Diamante:     💎 con color #B9F2FF
```

### 9.3 Uso con Aria

```html
<!-- Ícono decorativo (no transmite información) -->
<Icon aria-hidden="true" />

<!-- Ícono con significado (se usa solo sin texto) -->
<button aria-label="Cerrar">
  <XIcon aria-hidden="true" />
</button>

<!-- Ícono acompañado de texto (el texto ya lo describe) -->
<button>
  <PlusIcon aria-hidden="true" />
  Añadir
</button>
```

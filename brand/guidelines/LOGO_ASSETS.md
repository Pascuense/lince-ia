# LINCE — Especificaciones de Logo y Assets

**Versión 2.0.0** | Guía Completa de Logo

---

## 1. Concepto del Logo

El logo de LINCE combina:
- **Isotipo**: Representación estilizada de un lince (felino con visión excepcional), evocando la precisión y agudeza de la inteligencia artificial
- **Logotipo**: Wordmark "LINCE" en Inter ExtraBold (800), todo en mayúsculas
- **Tagline** (opcional): "Plataforma EdTech de IA" en Inter Regular

---

## 2. Variaciones del Logo

### 2.1 Logo Completo Horizontal (Principal)

```
Archivo:      brand/logos/lince-logo-full.svg
Composición:  Isotipo (izquierda) + Wordmark (derecha)
Spacing:      16px entre isotipo y texto
Proporción:   ~4:1 (ancho:alto)
Uso:          Header web, documentos, presentaciones, email header
Colores:      Isotipo en cyan #00E5FF, Wordmark en blanco #FFFFFF
```

### 2.2 Solo Icono (Cuadrado)

```
Archivo:      brand/logos/lince-logo-icon.svg
Composición:  Solo isotipo, cuadrado con padding interno 12.5%
Uso:          Favicon, app icon, avatar de perfil, social media
Tamaño mínimo: 32px (16px no recomendado salvo necesidad técnica)
Colores:      Isotipo en #00E5FF sobre fondo #0A0A0A
```

### 2.3 Versión Modo Oscuro

```
Archivo:      brand/logos/lince-logo-dark.svg
Fondo:        Transparente (para uso sobre #0A0A0A a #2A2A2A)
Isotipo:      #00E5FF
Wordmark:     #FFFFFF
Tagline:      #B0B0B0 (si se incluye)
```

### 2.4 Versión Modo Claro

```
Archivo:      brand/logos/lince-logo-light.svg
Fondo:        Transparente (para uso sobre blancos y grises claros)
Isotipo:      #0099CC (cyan oscurecido para contraste sobre blanco)
Wordmark:     #0A0A0A
Tagline:      #707070 (si se incluye)
```

### 2.5 Versión Monocromática

```
Archivo:      brand/logos/lince-logo-mono.svg
Colores:      Un solo color — negro #0A0A0A O blanco #FFFFFF
Uso:          Impresión en un color, sellos, bordados, grabados
Nota:         Mantiene todas las proporciones y detalles del logo principal
```

---

## 3. Tamaños y Proporciones

### 3.1 Logo Completo

| Uso | Ancho mínimo | Ancho recomendado |
|---|---|---|
| Favicon (solo icono) | 16px | 32px+ |
| App icon mobile | 64px | 128px+ |
| Header web mobile | 100px | 120px |
| Header web desktop | 120px | 160px |
| Email header | 140px | 180px |
| Presentación slide | 160px | 240px |
| Impresión | 25mm | 40mm+ |

### 3.2 Solo Icono

| Uso | Tamaño |
|---|---|
| Favicon 16x16 | 16px (solo forma simplificada) |
| Favicon 32x32 | 32px |
| iOS icon | 60px, 120px, 180px |
| Android icon | 48px, 72px, 96px, 144px, 192px |
| Perfil social | 400x400px |
| Open Graph | En composición 1200x630px |

---

## 4. Espacio de Seguridad

El espacio de seguridad mínimo alrededor del logo es igual al **alto del isotipo × 0.5**.

```
Logo height: H
Clear space: H × 0.5 en todos los lados

Ejemplo con logo de 40px de alto:
  Espacio mínimo: 20px en todos los lados
```

Dentro de esta zona de seguridad no puede aparecer:
- Otro logo o marca
- Texto (excepto el tagline oficial parte del logo)
- Bordes o marcos
- Elementos decorativos
- Imágenes de fondo con contraste insuficiente

---

## 5. Usos Correctos e Incorrectos

### 5.1 ✅ Usos Permitidos

- Logo sobre fondo `#0A0A0A` (modo oscuro)
- Logo sobre fondo `#1A1A1A` (superficies)
- Logo sobre fondos con suficiente contraste (≥ 3:1)
- Escala proporcional (manteniendo ratio)
- Versión monocromática en negro sobre blanco
- Versión monocromática en blanco sobre negro

### 5.2 ❌ Usos No Permitidos

- **No distorsionar**: No estirar o comprimir en ningún eje
- **No rotar**: El logo siempre horizontal
- **No recolorear**: Solo paletas aprobadas
- **No añadir efectos**: Sin sombras, brillos o degradados no especificados
- **No superponer**: Sin texto u otros elementos sobre el logo
- **No bajo contraste**: No usar sobre fondos con contraste < 3:1
- **No en fondos complejos**: No sobre fotografías o patrones sin overlay
- **No pixelar**: Usar siempre SVG o versiones de alta resolución
- **No separar**: No usar isotipo e imagotipo con proporciones diferentes

---

## 6. Logo en Aplicaciones Específicas

### 6.1 Aplicación Web (Header)

```css
.logo-container {
  height: 40px;           /* Desktop */
  /* Mobile: 32px */
}
.logo-container img {
  height: 100%;
  width: auto;
}
```

### 6.2 Aplicación Móvil (App Icon)

El icono de app usa el isotipo solo en un fondo cyan sólido:
```
Background:    #00E5FF (cyan de marca)
Isotipo:       #0A0A0A (negro, invertido para visibilidad)
Corner radius: Sistema operativo (iOS: 22%, Android: variable)
Padding:       ~15% del total del icono
```

### 6.3 Open Graph / Social Sharing

```
Dimensiones: 1200x630px
Layout:      Logo centrado, fondo #0A0A0A
             Tagline debajo en Inter 400, 24px, #B0B0B0
Variante:    Con gradiente mesh de marca en background (sutil)
```

### 6.4 Email Footer

```
Logo:        Versión modo oscuro, máx 160px ancho
Background:  #0A0A0A
Padding:     24px alrededor del logo
Link:        Logo enlaza a https://lince.ia (URL de la plataforma)
```

---

## 7. Archivos Disponibles

### 7.1 Directorio brand/logos/

```
lince-logo-full.svg     — Logo completo horizontal (oscuro)
lince-logo-icon.svg     — Solo isotipo cuadrado
lince-logo-dark.svg     — Versión para fondos oscuros
lince-logo-light.svg    — Versión para fondos claros
lince-logo-mono.svg     — Versión monocromática
```

> **Nota**: Los archivos SVG de logo deben ser creados por el equipo de diseño 
> siguiendo estas especificaciones. Los placeholders en el directorio son 
> referencias hasta la entrega de los assets finales.

### 7.2 Formatos de Exportación Recomendados

| Formato | Uso | Resolución |
|---|---|---|
| SVG | Web, escalable | Vector |
| PNG transparente | Web, cuando SVG no es viable | 2x (retina) |
| PDF | Impresión, documentos | Vector |
| EPS | Agencias de diseño, imprenta | Vector |
| WebP | Optimización web (con SVG fallback) | 2x |

---

## 8. Solicitud de Assets

Para solicitar archivos de logo en formatos específicos o para usos no cubiertos en esta guía, contactar al equipo de diseño de ACNB IA SL con:

1. Descripción del uso previsto
2. Tamaño y formato requerido
3. Fondo sobre el que se usará
4. Contexto (web, impresión, digital, etc.)

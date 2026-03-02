import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Bienvenida / Onboarding Page', () => {
  const pagesDir = path.resolve(__dirname, '../client/src/pages');
  const appPath = path.resolve(__dirname, '../client/src/App.tsx');

  it('Bienvenida.tsx page file exists', () => {
    const filePath = path.join(pagesDir, 'Bienvenida.tsx');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('Bienvenida page has all required i18n languages (es, en, zh)', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    // Steps should have es, en, zh keys (unquoted object keys)
    expect(content).toContain('es: [');
    expect(content).toContain('en: [');
    expect(content).toContain('zh: [');
    // STEPS object should have all three languages
    expect(content).toMatch(/STEPS:\s*Record/);
  });

  it('Bienvenida page has 6 onboarding steps per language', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    // Count all step id definitions — should be 6 per language x 3 languages = 18
    const allStepIds = content.match(/id: "(welcome|avatars|tools|gamification|play|ready)"/g) || [];
    expect(allStepIds.length).toBe(18); // 6 steps x 3 languages
  });

  it('Bienvenida page has required step IDs', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    const requiredIds = ['welcome', 'avatars', 'tools', 'gamification', 'play', 'ready'];
    for (const id of requiredIds) {
      expect(content).toContain(`id: "${id}"`);
    }
  });

  it('Bienvenida page uses AVATAR_FRONTAL for avatar images', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('AVATAR_FRONTAL');
    expect(content).toContain('AvatarCarousel');
  });

  it('Bienvenida page has localStorage persistence', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('lince-bienvenida-completed');
    expect(content).toContain('localStorage.setItem');
    expect(content).toContain('localStorage.getItem');
  });

  it('Bienvenida page has skip functionality', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('handleSkip');
    expect(content).toContain('labels.skip');
  });

  it('Bienvenida page has swipe/touch support', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('onTouchStart');
    expect(content).toContain('onTouchMove');
    expect(content).toContain('onTouchEnd');
  });

  it('Bienvenida page has keyboard navigation', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('ArrowRight');
    expect(content).toContain('ArrowLeft');
    expect(content).toContain('Escape');
  });

  it('Bienvenida page has final step with multiple destination buttons', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('FinalStepButtons');
    expect(content).toContain('/jugar');
    expect(content).toContain('/prompt-studio');
    expect(content).toContain('/personajes');
    expect(content).toContain('/arsenal-ia');
  });

  it('App.tsx has /bienvenida route registered', () => {
    const content = fs.readFileSync(appPath, 'utf-8');
    expect(content).toContain('"/bienvenida"');
    expect(content).toContain('Bienvenida');
  });

  it('App.tsx lazy-loads Bienvenida page', () => {
    const content = fs.readFileSync(appPath, 'utf-8');
    expect(content).toContain('import("./pages/Bienvenida")');
  });

  it('Register.tsx redirects new users to /bienvenida', () => {
    const registerPath = path.join(pagesDir, 'Register.tsx');
    const content = fs.readFileSync(registerPath, 'utf-8');
    expect(content).toContain('lince-bienvenida-completed');
    expect(content).toContain('/bienvenida');
  });

  it('Login.tsx redirects first-time users to /bienvenida', () => {
    const loginPath = path.join(pagesDir, 'Login.tsx');
    const content = fs.readFileSync(loginPath, 'utf-8');
    expect(content).toContain('lince-bienvenida-completed');
    expect(content).toContain('/bienvenida');
  });

  it('Bienvenida page has progress indicator', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    expect(content).toContain('ProgressDots');
  });

  it('Bienvenida page features section covers key app areas', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'Bienvenida.tsx'), 'utf-8');
    // Should mention key features (renamed labels)
    expect(content).toContain('Crear Imagen');
    expect(content).toContain('Mi Avatar');
    expect(content).toContain('Aprender Prompts');
    expect(content).toContain('Herramientas IA');
    expect(content).toContain('LinceCoins');
    expect(content).toContain('XP');
    expect(content).toContain('Batallas');
    expect(content).toContain('Cursos');
  });
});

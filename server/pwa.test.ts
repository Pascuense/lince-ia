import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('PWA Configuration', () => {
  const publicDir = path.resolve(__dirname, '../client/public');

  it('manifest.json exists and is valid JSON', () => {
    const manifestPath = path.join(publicDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    
    expect(manifest.name).toBe('LINCE IA — Aprende IA Jugando');
    expect(manifest.short_name).toBe('LINCE IA');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.background_color).toBe('#030a04');
    expect(manifest.theme_color).toBe('#00E5FF');
    // PWABuilder required fields
    expect(manifest.id).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.dir).toBe('ltr');
    expect(manifest.prefer_related_applications).toBe(false);
    expect(manifest.related_applications).toBeDefined();
    expect(Array.isArray(manifest.related_applications)).toBe(true);
    expect(manifest.screenshots).toBeDefined();
    expect(manifest.screenshots.length).toBeGreaterThanOrEqual(2);
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(1);
    // PWABuilder Round 2 fields
    expect(manifest.iarc_rating_id).toBeDefined();
    expect(manifest.scope_extensions).toBeDefined();
    expect(manifest.file_handlers).toBeDefined();
    expect(manifest.share_target).toBeDefined();
    expect(manifest.share_target.action).toBe('/');
    expect(manifest.widgets).toBeDefined();
    expect(manifest.note_taking).toBeDefined();
    expect(manifest.display_override).toContain('tabbed');
  });

  it('manifest.json has required icon sizes for PWA installability', () => {
    const manifestPath = path.join(publicDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
    
    const sizes = manifest.icons.map((icon: any) => icon.sizes);
    // Chrome requires at least 192x192 and 512x512
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    
    // Should have maskable icons including 512x512
    const maskableIcons = manifest.icons.filter((icon: any) => icon.purpose?.includes('maskable'));
    expect(maskableIcons.length).toBeGreaterThanOrEqual(1);
    const maskable512 = maskableIcons.find((icon: any) => icon.sizes === '512x512');
    expect(maskable512).toBeDefined();
  });

  it('manifest.json icons have valid CDN URLs', () => {
    const manifestPath = path.join(publicDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    
    for (const icon of manifest.icons) {
      // Icons should be CDN URLs or local /icons/ paths
      expect(icon.src).toMatch(/^(https:\/\/files\.manuscdn\.com\/|\/icons\/)/);
      expect(icon.type).toBe('image/png');
      expect(icon.sizes).toMatch(/^\d+x\d+$/);
    }
  });

  it('sw.js Service Worker file exists', () => {
    const swPath = path.join(publicDir, 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
    
    const content = fs.readFileSync(swPath, 'utf-8');
    // Should have install, activate, and fetch event listeners
    expect(content).toContain("addEventListener('install'");
    expect(content).toContain("addEventListener('activate'");
    expect(content).toContain("addEventListener('fetch'");
    // Should have cache names
    expect(content).toContain('CACHE_NAME');
    expect(content).toContain('STATIC_CACHE');
    // Periodic Background Sync
    expect(content).toContain("addEventListener('periodicsync'");
    expect(content).toContain('periodicSyncHandler');
  });

  it('sw.js has proper cache strategies', () => {
    const swPath = path.join(publicDir, 'sw.js');
    const content = fs.readFileSync(swPath, 'utf-8');
    
    // Should have networkFirst strategy
    expect(content).toContain('networkFirst');
    // Should have cacheFirst strategy
    expect(content).toContain('cacheFirst');
    // Should skip API requests from caching
    expect(content).toContain('/api/');
    // Should handle CDN assets
    expect(content).toContain('manuscdn.com');
  });

  it('index.html has manifest link', () => {
    const indexPath = path.resolve(__dirname, '../client/index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    expect(content).toContain('rel="manifest"');
    expect(content).toContain('href="/manifest.json"');
  });

  it('index.html has theme-color meta tag', () => {
    const indexPath = path.resolve(__dirname, '../client/index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    expect(content).toContain('name="theme-color"');
    expect(content).toContain('content="#00E5FF"');
  });

  it('index.html has apple-mobile-web-app meta tags', () => {
    const indexPath = path.resolve(__dirname, '../client/index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    expect(content).toContain('apple-mobile-web-app-capable');
    expect(content).toContain('apple-mobile-web-app-status-bar-style');
    expect(content).toContain('apple-mobile-web-app-title');
    expect(content).toContain('apple-touch-icon');
  });

  it('index.html has favicon links', () => {
    const indexPath = path.resolve(__dirname, '../client/index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    expect(content).toContain('rel="icon"');
    // Should have multiple sizes
    expect(content).toContain('sizes="16x16"');
    expect(content).toContain('sizes="32x32"');
    expect(content).toContain('sizes="192x192"');
    expect(content).toContain('sizes="512x512"');
  });

  it('PWAInstallBanner component exists', () => {
    const componentPath = path.resolve(__dirname, '../client/src/components/PWAInstallBanner.tsx');
    expect(fs.existsSync(componentPath)).toBe(true);
    
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('PWAInstallBanner');
    expect(content).toContain('usePWA');
  });

  it('usePWA hook exists', () => {
    const hookPath = path.resolve(__dirname, '../client/src/hooks/usePWA.ts');
    expect(fs.existsSync(hookPath)).toBe(true);
    
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('serviceWorker');
    expect(content).toContain('beforeinstallprompt');
    expect(content).toContain('installApp');
  });

  it('App.tsx includes PWAInstallBanner', () => {
    const appPath = path.resolve(__dirname, '../client/src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');
    
    expect(content).toContain('PWAInstallBanner');
    expect(content).toContain('<PWAInstallBanner');
  });
});

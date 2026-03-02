import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Aviso Legal Page Tests
 * Verifies the legal notice page contains all required fiscal and legal information
 * as mandated by Spanish LSSI-CE (Ley 34/2002)
 */

const avisoLegalPath = path.resolve(__dirname, "../client/src/pages/AvisoLegal.tsx");
const avisoLegalContent = fs.readFileSync(avisoLegalPath, "utf-8");

const appTsxPath = path.resolve(__dirname, "../client/src/App.tsx");
const appTsxContent = fs.readFileSync(appTsxPath, "utf-8");

describe("AvisoLegal Page - File Existence & Route", () => {
  it("should have AvisoLegal.tsx page file", () => {
    expect(fs.existsSync(avisoLegalPath)).toBe(true);
  });

  it("should be registered as a route in App.tsx", () => {
    expect(appTsxContent).toContain("/aviso-legal");
    expect(appTsxContent).toContain("AvisoLegal");
  });

  it("should import AvisoLegal in App.tsx (lazy loaded)", () => {
    expect(appTsxContent).toContain('import("./pages/AvisoLegal")');
  });
});

describe("AvisoLegal Page - LSSI-CE Required Information (Art. 10)", () => {
  it("should contain the company name (razón social)", () => {
    expect(avisoLegalContent).toContain("ACNB IA SL");
  });

  it("should contain the NIF B24838690", () => {
    expect(avisoLegalContent).toContain("B24838690");
  });

  it("should contain the registered office address", () => {
    expect(avisoLegalContent).toContain("Avda Buenos Aires 10");
    expect(avisoLegalContent).toContain("50180 Utebo");
    expect(avisoLegalContent).toContain("Zaragoza");
  });

  it("should contain contact email", () => {
    expect(avisoLegalContent).toContain("info@acnb.es");
  });

  it("should contain the corporate website", () => {
    expect(avisoLegalContent).toContain("www.acnb.es");
  });

  it("should reference the LSSI-CE law", () => {
    expect(avisoLegalContent).toContain("Ley 34/2002");
    expect(avisoLegalContent).toContain("LSSI-CE");
  });

  it("should contain the commercial registry reference", () => {
    expect(avisoLegalContent).toContain("Registro Mercantil");
    expect(avisoLegalContent).toContain("Zaragoza");
  });
});

describe("AvisoLegal Page - Privacy Policy (RGPD/LOPDGDD)", () => {
  it("should reference RGPD", () => {
    expect(avisoLegalContent).toContain("RGPD");
    expect(avisoLegalContent).toContain("2016/679");
  });

  it("should reference LOPDGDD", () => {
    expect(avisoLegalContent).toContain("LOPDGDD");
    expect(avisoLegalContent).toContain("3/2018");
  });

  it("should contain DPO contact", () => {
    expect(avisoLegalContent).toContain("dpo@lince.com");
  });

  it("should contain privacy contact", () => {
    expect(avisoLegalContent).toContain("privacy@lince.com");
  });

  it("should mention AEPD (Spanish Data Protection Agency)", () => {
    expect(avisoLegalContent).toContain("AEPD");
    expect(avisoLegalContent).toContain("www.aepd.es");
  });

  it("should describe user rights (access, rectification, erasure, portability)", () => {
    // Spanish version
    expect(avisoLegalContent).toContain("acceso");
    expect(avisoLegalContent).toContain("rectificación");
    expect(avisoLegalContent).toContain("supresión");
    expect(avisoLegalContent).toContain("portabilidad");
  });

  it("should describe data security measures", () => {
    expect(avisoLegalContent).toContain("HTTPS");
    expect(avisoLegalContent).toContain("cifrado");
  });
});

describe("AvisoLegal Page - Intellectual Property", () => {
  it("should mention LINCE® trademark", () => {
    expect(avisoLegalContent).toContain("LINCE®");
  });

  it("should list the LINCE Family characters", () => {
    expect(avisoLegalContent).toContain("Duolingenio");
    expect(avisoLegalContent).toContain("Yayolín");
    expect(avisoLegalContent).toContain("Duolincito");
    expect(avisoLegalContent).toContain("Lincepreneur");
    expect(avisoLegalContent).toContain("Mamálince");
    expect(avisoLegalContent).toContain("Papálince");
  });

  it("should reference IP law (RDL 1/1996)", () => {
    expect(avisoLegalContent).toContain("1/1996");
  });

  it("should reference Trademark law (Ley 17/2001)", () => {
    expect(avisoLegalContent).toContain("17/2001");
  });

  it("should reference Trade Secrets law (Ley 1/2019)", () => {
    expect(avisoLegalContent).toContain("1/2019");
  });
});

describe("AvisoLegal Page - Cookie Policy", () => {
  it("should describe session cookies", () => {
    expect(avisoLegalContent).toContain("Cookie de sesión");
    expect(avisoLegalContent).toContain("Session cookie");
  });

  it("should describe language preference cookies", () => {
    expect(avisoLegalContent).toContain("Preferencia de idioma");
    expect(avisoLegalContent).toContain("Language preference");
  });

  it("should describe analytics cookies (Umami)", () => {
    expect(avisoLegalContent).toContain("Umami");
  });
});

describe("AvisoLegal Page - Jurisdiction", () => {
  it("should specify Zaragoza courts as jurisdiction", () => {
    // Spanish version
    expect(avisoLegalContent).toContain("Juzgados y Tribunales de Zaragoza");
    // English version
    expect(avisoLegalContent).toContain("Courts and Tribunals of Zaragoza");
  });
});

describe("AvisoLegal Page - Multi-language Support", () => {
  it("should have Spanish translations", () => {
    expect(avisoLegalContent).toContain('"es"');
    expect(avisoLegalContent).toContain("Aviso Legal");
  });

  it("should have English translations", () => {
    expect(avisoLegalContent).toContain('"en"');
    expect(avisoLegalContent).toContain("Legal Notice");
  });

  it("should have Chinese translations", () => {
    expect(avisoLegalContent).toContain('"zh"');
    expect(avisoLegalContent).toContain("法律声明");
  });

  it("should have language selector flags", () => {
    expect(avisoLegalContent).toContain("🇪🇸");
    expect(avisoLegalContent).toContain("🇬🇧");
    expect(avisoLegalContent).toContain("🇨🇳");
  });
});

describe("AvisoLegal Page - Creator Information", () => {
  it("should mention ACNB IA SL as creator", () => {
    expect(avisoLegalContent).toContain("ACNB IA SL");
  });
});

describe("AvisoLegal Page - All 9 Required Sections", () => {
  const requiredSections = [
    "s1Title",
    "s2Title",
    "s3Title",
    "s4Title",
    "s5Title",
    "s6Title",
    "s7Title",
    "s8Title",
    "s9Title",
  ];

  requiredSections.forEach((section) => {
    it(`should contain section key: ${section}`, () => {
      expect(avisoLegalContent).toContain(section);
    });
  });
});

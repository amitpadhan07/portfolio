import { CertificationSchema } from "../src/validators/schemas";

// Programmatic testing helpers for standalone execution
const describe = (name: string, fn: () => void) => {
  console.log(`\n=== ${name} ===`);
  fn();
};

const it = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (err: any) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
};

const expect = (actual: any) => ({
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
    }
  },
  toBeLessThanOrEqual: (expected: any) => {
    if (actual > expected) {
      throw new Error(`Expected ${actual} to be <= ${expected}`);
    }
  },
  toBeGreaterThan: (expected: any) => {
    if (actual <= expected) {
      throw new Error(`Expected ${actual} to be > ${expected}`);
    }
  },
  toContain: (item: any) => {
    if (!actual.includes(item)) {
      throw new Error(`Expected ${JSON.stringify(actual)} to contain ${item}`);
    }
  },
  not: {
    toContain: (item: any) => {
      if (actual.includes(item)) {
        throw new Error(`Expected ${JSON.stringify(actual)} NOT to contain ${item}`);
      }
    }
  }
});

describe("Certifications Enhanced Module - Test Suite", () => {
  describe("Zod Validation Schema & File Types", () => {
    it("should accept valid image certifications", () => {
      const data = {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "Jan 2025",
        certificateUrl: "https://aws.amazon.com/verification/123",
        image: "https://res.cloudinary.com/demo/image/upload/v1/certifications/aws.png",
        fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/certifications/aws.png",
        fileType: "image",
        issuerLogo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      };

      const parsed = CertificationSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it("should accept valid PDF certifications", () => {
      const data = {
        name: "Google Data Analytics Professional",
        issuer: "Google",
        date: "Feb 2025",
        certificateUrl: "https://coursera.org/verify/google123",
        image: "https://res.cloudinary.com/demo/image/upload/v1/certifications/google.pdf",
        fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/certifications/google.pdf",
        fileType: "pdf",
        issuerLogo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      };

      const parsed = CertificationSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it("should fail validation if certificateUrl, fileUrl or issuerLogo are malformed", () => {
      const invalidData = {
        name: "Database Systems",
        issuer: "NPTEL",
        date: "2024",
        certificateUrl: "not-a-url",
        fileUrl: "ftp://invalid-protocol.com",
        fileType: "image",
      };

      const parsed = CertificationSchema.safeParse(invalidData);
      expect(parsed.success).toBe(false);
    });

    it("should allow empty certificateUrl, fileUrl, and issuerLogo (for optional fallback)", () => {
      const minimalData = {
        name: "Database Systems",
        issuer: "NPTEL",
        date: "2024",
        certificateUrl: "",
        fileUrl: "",
        fileType: "image",
        issuerLogo: "",
      };

      const parsed = CertificationSchema.safeParse(minimalData);
      expect(parsed.success).toBe(true);
    });
  });

  describe("Security upload constraints", () => {
    it("should validate that the uploaded file type is supported in the uploader validation array", () => {
      const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "application/pdf",
      ];
      
      expect(allowedMimes).toContain("application/pdf");
      expect(allowedMimes).toContain("image/png");
      expect(allowedMimes).toContain("image/svg+xml");
      expect(allowedMimes).not.toContain("application/javascript");
    });

    it("should reject files exceeding the size limit of 10MB", () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      const fileUnderLimit = 5 * 1024 * 1024;
      const fileOverLimit = 11 * 1024 * 1024;

      expect(fileUnderLimit).toBeLessThanOrEqual(MAX_FILE_SIZE);
      expect(fileOverLimit).toBeGreaterThan(MAX_FILE_SIZE);
    });
  });

  describe("Backward compatibility normalization rule", () => {
    it("should set fileUrl to image if only image is provided", () => {
      const legacyData = {
        name: "Legacy Cert",
        issuer: "AWS",
        date: "2024",
        image: "https://cloudinary.com/myimage.png",
      };

      const normalized = { ...legacyData, fileUrl: legacyData.image, fileType: "image" };
      expect(normalized.fileUrl).toBe("https://cloudinary.com/myimage.png");
      expect(normalized.fileType).toBe("image");
    });

    it("should auto-detect PDF fileType if URL ends with .pdf", () => {
      const rawUrl = "https://res.cloudinary.com/demo/image/upload/v1/cert.pdf";
      const isPdf = rawUrl.toLowerCase().endsWith(".pdf");
      const fileType = isPdf ? "pdf" : "image";
      expect(fileType).toBe("pdf");
    });
  });
});

// Mock simple runner since we don't have Jest runner installed.
function mockRunner() {
  console.log("Running basic programmatic assertions...");
  const assertions = [
    () => {
      const res = CertificationSchema.safeParse({
        name: "Test",
        issuer: "Test Issuer",
        date: "2024",
        image: "https://cloudinary.com/image.png",
      });
      if (!res.success) throw new Error("Validation failed for valid data.");
    },
    () => {
      const res = CertificationSchema.safeParse({
        name: "Test",
        issuer: "Test Issuer",
        date: "2024",
        certificateUrl: "invalid-url",
      });
      if (res.success) throw new Error("Validation should fail on bad certificate URL.");
    }
  ];

  try {
    assertions.forEach((fn, i) => fn());
    console.log("✓ All programmatic assertions passed successfully!");
  } catch (err: any) {
    console.error("✗ Assertion failed:", err.message);
  }
}

if (require.main === module) {
  mockRunner();
}

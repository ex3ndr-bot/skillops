import { SecurityFinding, SecurityScanResult, Skill } from "@/lib/types";

const dangerousPatterns = [
  {
    id: "eval",
    test: /eval\s*\(/i,
    title: "Dynamic evaluation detected",
    description: "This skill appears to execute dynamically generated code.",
    severity: "high" as const,
    penalty: 34,
  },
  {
    id: "exec",
    test: /\bexec\s*\(/i,
    title: "Command execution detected",
    description: "This skill appears to invoke runtime command execution.",
    severity: "high" as const,
    penalty: 28,
  },
];

const networkPattern = /\b(fetch|axios|https?:\/\/|XMLHttpRequest|WebSocket)\b/i;

function buildFinding(
  id: string,
  title: string,
  description: string,
  severity: SecurityFinding["severity"],
): SecurityFinding {
  return { id, title, description, severity };
}

export class SecurityScanner {
  static scan(skill: Skill, source = ""): SecurityScanResult {
    const findings: SecurityFinding[] = [];
    let score = 100;
    const scanText = [skill.description, skill.dependencies.join(" "), source].join("\n");

    for (const pattern of dangerousPatterns) {
      if (pattern.test.test(scanText)) {
        findings.push(
          buildFinding(pattern.id, pattern.title, pattern.description, pattern.severity),
        );
        score -= pattern.penalty;
      }
    }

    if (networkPattern.test(scanText) && !this.hasNetworkPermission(skill)) {
      findings.push(
        buildFinding(
          "network-permission",
          "Network access is not declared",
          "The skill references outbound network access without an approved network permission.",
          "high",
        ),
      );
      score -= 24;
    }

    if (skill.permissions.includes("shell.exec")) {
      findings.push(
        buildFinding(
          "shell-exec",
          "Shell execution permission granted",
          "Shell execution increases blast radius and should remain tightly scoped.",
          "medium",
        ),
      );
      score -= 12;
    }

    if (skill.permissions.includes("secrets.read")) {
      findings.push(
        buildFinding(
          "secrets",
          "Secret access requires additional review",
          "Skills that read secrets should be limited to approved runtime environments.",
          "medium",
        ),
      );
      score -= 10;
    }

    if (skill.permissions.includes("filesystem.write")) {
      findings.push(
        buildFinding(
          "filesystem-write",
          "Filesystem write access enabled",
          "Write access should be constrained to explicitly approved directories.",
          "low",
        ),
      );
      score -= 6;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      findings,
    };
  }

  static hasNetworkPermission(skill: Skill) {
    return (
      skill.permissions.includes("network.access") ||
      skill.permissions.includes("network.outbound")
    );
  }
}

export function runSecurityScan(input: Skill, source = "") {
  return SecurityScanner.scan(input, source);
}

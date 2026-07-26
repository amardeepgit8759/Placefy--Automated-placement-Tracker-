export interface RuleResult {
  domain: string;
  required: number;
  actual: number;
  passed: boolean;
  explanation: string;
}

export const ROLE_REQUIREMENTS: Record<string, Record<string, number>> = {
  "Backend-Beginner": { DSA: 50, "Core Subjects": 50, Aptitude: 50, Development: 50 },
  "Backend-Intermediate": { DSA: 65, "Core Subjects": 60, Aptitude: 55, Development: 65 },
  "Backend-Advanced": { DSA: 80, "Core Subjects": 75, Aptitude: 65, Development: 80 },
  "Frontend-Beginner": { DSA: 40, "Core Subjects": 45, Aptitude: 50, Development: 60 },
  "Frontend-Intermediate":{ DSA: 55, "Core Subjects": 55, Aptitude: 55, Development: 75 },
  "Frontend-Advanced": { DSA: 70, "Core Subjects": 65, Aptitude: 60, Development: 85 },
  "Fullstack-Beginner": { DSA: 45, "Core Subjects": 50, Aptitude: 50, Development: 60 },
  "Fullstack-Intermediate": { DSA: 60, "Core Subjects": 60, Aptitude: 55, Development: 75 },
  "Fullstack-Advanced": { DSA: 75, "Core Subjects": 70, Aptitude: 65, Development: 85 },
  "DSA-Beginner": { DSA: 60, "Core Subjects": 40, Aptitude: 50, Development: 40 },
  "DSA-Intermediate": { DSA: 75, "Core Subjects": 50, Aptitude: 60, Development: 50 },
  "DSA-Advanced": { DSA: 90, "Core Subjects": 60, Aptitude: 70, Development: 60 },
  "Data Science-Beginner": { DSA: 50, "Core Subjects": 50, Aptitude: 60, Development: 40 },
  "Data Science-Intermediate": { DSA: 65, "Core Subjects": 60, Aptitude: 75, Development: 50 },
  "Data Science-Advanced": { DSA: 80, "Core Subjects": 70, Aptitude: 85, Development: 60 },
  "Mobile-Beginner": { DSA: 40, "Core Subjects": 45, Aptitude: 45, Development: 60 },
  "Mobile-Intermediate": { DSA: 55, "Core Subjects": 55, Aptitude: 50, Development: 75 },
  "Mobile-Advanced": { DSA: 70, "Core Subjects": 65, Aptitude: 60, Development: 85 },
};

export function evaluateRules(domainScores: Record<string, number>, role: string | null, level: string | null): RuleResult[] {
  if (!domainScores) return [];
  
  const safeRole = role || "Backend";
  const safeLevel = level || "Intermediate";
  const key = `${safeRole}-${safeLevel}`;
  
  // Fallback to Backend-Intermediate if specific combo isn't found
  const requirements = ROLE_REQUIREMENTS[key] || ROLE_REQUIREMENTS["Backend-Intermediate"];
  
  return Object.entries(domainScores).map(([domain, actual]) => {
    // Normalization mapping for standard keys vs AI generated keys if needed,
    // assuming AI uses "Development" or "Dev Skills", "Core Subjects" or "Core CS".
    let reqKey = domain;
    if (!requirements[domain]) {
       if (domain.includes("Dev")) reqKey = "Development";
       if (domain.includes("Core")) reqKey = "Core Subjects";
    }

    const required = requirements[reqKey] || 50; // Fallback to 50 if unknown domain
    const passed = actual >= required;
    
    const explanation = passed
      ? `${domain} score (${actual}%) meets or exceeds the ${required}% requirement for ${safeRole} ${safeLevel} roles.`
      : `${domain} score (${actual}%) is below the ${required}% required for ${safeRole} ${safeLevel} roles.`;
      
    return {
      domain,
      required,
      actual,
      passed,
      explanation
    };
  });
}

import { Standard } from '../types/standards';

export const standardsData: Standard[] = [
  {
    id: 'ts-strict-mode',
    title: 'TypeScript Strict Mode',
    category: 'CODE_STYLE',
    priority: 'MUST',
    description: 'Use explicit return types for public functions. Avoid "any" at all costs.',
    rationale: 'Ensures type safety and maintainability across the codebase.',
    keywords: ['typescript', 'strict', 'any'],
    examples: [
      {
        type: 'good',
        language: 'typescript',
        code: 'function calculateTotal(items: Item[]): number {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
        explanation: 'Explicit return type provides clarity.'
      },
      {
        type: 'bad',
        language: 'typescript',
        code: 'function processData(data: any) {\n  return data.value;\n}',
        explanation: 'Using any loses all type benefits.'
      }
    ]
  },
  {
    id: 'interface-vs-type',
    title: 'Interface vs Type',
    category: 'CODE_STYLE',
    priority: 'MUST',
    description: 'Prefer interfaces for object shapes, use type for unions, intersections, and aliases.',
    rationale: 'Interfaces are more extensible and better for object-oriented patterns in TS.',
    keywords: ['interface', 'type', 'union'],
    examples: [
      {
        type: 'good',
        language: 'typescript',
        code: 'interface User {\n  id: string;\n  name: string;\n}\n\ntype Status = "active" | "inactive";',
        explanation: 'Correct usage of interface for objects and type for unions.'
      }
    ]
  },
  {
    id: 'null-checks',
    title: 'Strict Null Checks',
    category: 'CODE_STYLE',
    priority: 'MUST',
    description: 'Use optional chaining (?.) and nullish coalescing (??) instead of logical OR (||) for defaults.',
    rationale: 'Logical OR can swallow valid falsy values like 0 or empty strings.',
    keywords: ['null', 'undefined', 'coalescing'],
    examples: [
      {
        type: 'good',
        language: 'typescript',
        code: 'const city = user?.address?.city;\nconst name = user.name ?? "Anonymous";',
        explanation: 'Safe access and intentional default values.'
      }
    ]
  },
  {
    id: 'error-handling-principles',
    title: 'Fail Fast, Fail Loud',
    category: 'ERROR_HANDLING',
    priority: 'MUST',
    description: 'Never swallow errors silently. Log with context and handle intentionally.',
    rationale: 'Silent errors are the hardest to debug and can lead to corrupted state.',
    keywords: ['error', 'exception', 'logging'],
    examples: [
      {
        type: 'good',
        language: 'typescript',
        code: 'try {\n  await api.fetch();\n} catch (error) {\n  logger.error("Failed to fetch", { error });\n  throw error;\n}',
        explanation: 'Explicit logging and rethrowing preserves context.'
      }
    ]
  }
];

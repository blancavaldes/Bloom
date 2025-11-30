# Test Report

Generated: 2025-11-30

Summary
- Test suites: 9 passed, 9 total
- Tests: 26 passed, 26 total

Coverage (global):
- Statements: 89.79%
- Branches: 84.28%
- Functions: 70.58%
- Lines: 98.43%

Notes
- Jest is configured with a global coverage threshold of 70% for statements/branches/functions/lines. The CI pipeline runs `npm test` which enforces that threshold; the pipeline will fail if tests fail or coverage is below 70%.
- The GitHub Actions workflow uploads the generated `coverage/` directory as an artifact named `coverage-report` on every run. Download it from the workflow run artifacts to view the HTML report (`coverage/lcov-report/index.html`).

How to reproduce locally
```bash
npm ci
npm test
# open the HTML report (macOS)
open coverage/lcov-report/index.html
```

If you want the raw HTML files committed to the repository instead of using the CI artifact, I can add them — but they are typically large and environment-specific.

---
name: systematic-debugging
description: Use a structured root-cause-first debugging process for bugs, test failures, and unexpected behavior before proposing fixes.
---

# Systematic Debugging

## Iron Law

No fixes without root-cause investigation first.

## Phases

1. Reproduce and gather evidence.
2. Compare with known-good patterns.
3. Form a single hypothesis and test it minimally.
4. Fix the root cause and verify with tests.

## Escalation

If multiple repair attempts fail, stop guessing and reassess the architecture or assumptions.

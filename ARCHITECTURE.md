# ALGIZ architecture

## Repos

| Product | Repo | Job |
|---|---|---|
| BudVia | tahsinsakin/belvia | trip register |
| ALGIZ | tahsinsakin/algiz | training load |

Do not merge these codebases. Share patterns only: local-first, no analytics, GitHub Pages PWA.

## Data plane

```
Wearable HRV (later)
        |
        v
CNS score  <--+  Supplement PK(t)
        |     +  Thermal minutes
        v
Swap table: axial compound <-> machine variant
        |
        v
Session log (sets, reps, RPE, TUT, volume)
```

## Security target

- Health telemetry = E2EE blob. Cloud never sees plaintext.
- PWA: Web Crypto AES-256-GCM, wrapping key in IndexedDB (non-extractable when possible).
- Native later: iOS Secure Enclave / Android Keystore.
- No third-party analytics SDK.

## Roadmap

1. This PWA logs + readiness + swaps.
2. Native wrapper + hardware key.
3. Optional encrypted backup blob.
4. Wearable import (HealthKit / Health Connect) as *input*, not as the score itself.

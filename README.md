# ALGIZ

Separate product from [BudVia](https://github.com/tahsinsakin/belvia).

**Problem:** Whoop / Hevy / RP treat the body as one battery.  
**Bet:** isolate **CNS load** (master) from **local muscle load** (workers). If HRV / sleep / RPE say the master node is down, swap axial compounds for machine variations. Keep local volume.

Not a medical device. Scores are training heuristics.

## Live (after Pages on)

https://tahsinsakin.github.io/algiz/

## v0 (this repo)

- On-device PWA. No account.
- Philosophical gate on first open.
- Lift log (sets / reps / RPE / TUT).
- Supplement log (dose + half-life curve).
- Thermal recovery log (pool / sauna / steam) — **not** BudVia booking copied in.
- Readiness = `100 - cnsDrain + suppEfficacy(t) + thermalRestore`.
- Movement swap table when readiness < 70.

## What is not shipped yet

- Secure Enclave / StrongBox. Web Crypto AES-GCM + key in IndexedDB is the PWA stand-in.
- Wearable HRV ingest.
- Postgres / Prisma runtime. Schema is the target model.
- SAST/DAST pipeline.

Publisher: Tahsin Sakin · tahcem17@gmail.com

# DEPLOYMENT README

This handoff is **NOT READY FOR PRODUCTION DEPLOYMENT** until blockers in WEB_READY_QA.md are resolved.

Example precheck:
```powershell
.\VERIFY_WEB.ps1 -SitePath "G:\path\to\site" -PublicDataPath "..\web_data\WEB_READY_PRODUCTS.json" -ContactUrl "https://example.org/contact/"
```

Deploy only after verification passes:
```powershell
.\DEPLOY.ps1 -SitePath "G:\path\to\site" -HandoffPath ".." -ContactUrl "https://example.org/contact/" -AnalyticsProvider "GA4"
```

The scripts are parameterized and intentionally stop if contact/analytics/build/deploy commands are not supplied or verification fails.

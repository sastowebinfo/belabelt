# Firebase Hosting Deployment

This project is configured as a static Firebase Hosting site.

## Files added

- `firebase.json`: serves the project root as the hosting directory
- `.firebaseignore`: prevents local metadata and dependencies from being uploaded
- `.firebaserc`: points Firebase CLI to your project ID

## Before deploying

1. Replace `your-firebase-project-id` in `.firebaserc` with your real Firebase project ID.
2. Install the Firebase CLI if it is not already installed:

```powershell
npm install -g firebase-tools
```

3. Log in to Firebase:

```powershell
firebase login
```

## Deploy

Run this from the project root:

```powershell
firebase deploy --only hosting
```

## Optional: deploy without editing `.firebaserc`

If you prefer, you can skip step 1 and deploy directly with:

```powershell
firebase deploy --only hosting --project your-firebase-project-id
```
## Important: Cache Busting
Whenever you update images (even if you keep the same filename) or make significant changes, you should increment the `SITE_VERSION` at the top of `script.js`.

For example, change:
`const SITE_VERSION = '2.7';`
to:
`const SITE_VERSION = '2.8';`

This ensures that:
1.  Returning visitors immediately see the newest images.
2.  The browser skips the disk cache for all gallery and product assets.
3.  The internal gallery data (stored in `localStorage`) is correctly reset for all users.

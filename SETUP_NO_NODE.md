# College Event Management System — No Python / No Node

## Run
1. Extract the ZIP.
2. Open `index.html` directly in Chrome or Edge.
3. No Python, Node.js, npm, or local server is required.

## Supabase
Open `index.html` and replace:

```js
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';
const SUPABASE_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';
```

Use only the Supabase project URL and anon/publishable browser key.

Run `SUPABASE_REALTIME.sql` in Supabase SQL Editor to add the required tables to the Realtime publication.

## Realtime test
Open `index.html` in two browser windows. Create, edit, or delete an event in one window. The other window should update without a page refresh.

## Theme test
Use the moon/sun button in the navbar. Light/Dark mode changes immediately and persists after refresh.

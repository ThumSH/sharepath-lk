# Supabase Setup

Phase 3 uses Supabase for public app data only. Authentication, personal saved items, and user-specific tables are planned for a later phase.

## Steps

1. Create a Supabase project.
2. Copy the Project URL from the Supabase project settings or Connect panel.
3. Copy the Publishable Key from the same area.
4. Add these values to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

5. Open the Supabase SQL editor and run `supabase/schema.sql`.
6. Run `supabase/seed.sql` in the SQL editor to add sample educational data.
7. For Phase 4 account features, run `supabase/phase4-auth.sql` in the SQL editor after the Phase 3 schema and seed files.
8. Restart Expo with:

```bash
npx expo start -c
```

9. Confirm the app loads the Supabase sample data. If Supabase is unavailable, the app should continue showing local sample data.

## Key Safety

Do not place a service_role key, secret key, database password, or database connection string in the mobile app.

Use only:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

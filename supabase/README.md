# Supabase Migrations

This directory contains a full schema snapshot, to be applied to the Supabase project (`jsmsnznqoyiyakoodjez`). Snapshot originally generated from the previous project (`icxcsjcmpipbtwzydzks`).

## How to use

The SQL file recreates the entire database schema from scratch:

```bash
# Apply via Supabase CLI (if using local dev)
supabase db reset

# Or apply directly via the dashboard SQL editor
# Copy the contents of the .sql file and run it
```

## What's included

- **Enums**: `order_status`
- **Tables**: 15 tables (legacy Django-era + PN native)
- **Functions**: 7 RPC functions (`pn_create_order`, `pn_cancel_order`, `is_admin`, etc.)
- **Triggers**: `updated_at` auto-touch, new user profile creation
- **RLS Policies**: Full row-level security for all tables
- **Storage**: 4 buckets with read/write policies

## Migration history (applied on remote)

| Version | Name |
|---------|------|
| 20260902173307 | deepwork_schema_plus_rpc |
| 20260902173408 | deepwork_advisor_remediation |
| 20260903150314 | deepwork_gate1_remediation |
| 20260903152339 | deepwork_order_idempotency |
| 20260903164728 | deepwork_admin_stats_per_status |
| 20260912033005 | create_pn_schema |
| 20260912033025 | fix_pn_advisor_warns |
| 20260912121538 | create_pn_storage_buckets |
| 20260912143726 | allow_selfie_read_authenticated |

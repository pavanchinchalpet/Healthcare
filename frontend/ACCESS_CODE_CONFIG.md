# Access Code Configuration

## Overview

The healthcare system uses access codes for staff authentication instead of environment variables. This approach provides better security and easier configuration management.

## Configuration

Access codes are defined in `src/config/access-codes.ts`:

- **Admin**: `admin123` - Full system access
- **Doctor**: `doctor123` - Doctor-level access  
- **Staff**: `staff123` - General staff access

## Usage

1. Navigate to the Staff Access page (`/staff`)
2. Select your role (Admin or Doctor)
3. Enter the corresponding access code
4. Click "Unlock" to authenticate

## Security Notes

- Access codes are currently stored in the client-side configuration file
- In a production environment, these should be moved to server-side validation
- Consider implementing proper JWT-based authentication for enhanced security
- Access codes should be changed regularly and kept confidential

## Customization

To change access codes, edit the `ACCESS_CODES` object in `src/config/access-codes.ts`:

```typescript
export const ACCESS_CODES = {
  ADMIN: 'your-new-admin-code',
  DOCTOR: 'your-new-doctor-code',
  STAFF: 'your-new-staff-code',
} as const
```

## Migration from Environment Variables

The system has been migrated from using `NEXT_PUBLIC_STAFF_ACCESS_CODE` environment variable to the configuration file approach. This eliminates the need for environment variable configuration and provides better type safety.

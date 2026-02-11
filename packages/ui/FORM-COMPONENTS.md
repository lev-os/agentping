# Accessible Form Components

**Status:** ✅ **WCAG 2.1 Level AA Compliant**  
**Created:** December 9, 2025

These components are built on Radix UI primitives and follow accessibility best practices.

---

## Available Components

### 1. `<Label>`
Accessible label with proper associations.

```tsx
import { Label } from "@kingly/ui/components";

<Label htmlFor="model-name">Model Name</Label>
<Input id="model-name" />
```

**WCAG:** 3.3.2 Labels or Instructions (Level A) ✅

---

### 2. `<Input>`
Fully accessible text input with error states.

```tsx
import { Input } from "@kingly/ui/components";

<Input
  id="model-name"
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-id" : "help-id"}
  error={hasError}
  required
/>
```

**Props:**
- `error?: boolean` - Visual error styling
- `aria-invalid?: boolean` - Screen reader error indication
- All standard HTML input attributes

**WCAG:** 
- 1.3.1 Info and Relationships (Level A) ✅
- 4.1.2 Name, Role, Value (Level A) ✅

---

### 3. `<Textarea>`
Multi-line text input with same accessibility features as Input.

```tsx
import { Textarea } from "@kingly/ui/components";

<Textarea
  id="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  aria-invalid={hasError}
  error={hasError}
  rows={4}
  maxLength={500}
/>
```

**Props:**
- `error?: boolean` - Visual error styling
- `aria-invalid?: boolean` - Screen reader error indication
- All standard HTML textarea attributes

---

### 4. `<Checkbox>`
Radix UI checkbox with full keyboard and screen reader support.

```tsx
import { Checkbox } from "@kingly/ui/components";

<Checkbox
  id="agree"
  checked={agreed}
  onCheckedChange={(checked) => setAgreed(checked === true)}
  aria-describedby="checkbox-label"
/>
<Label htmlFor="agree" id="checkbox-label">
  I agree to the terms
</Label>
```

**Features:**
- Space/Enter to toggle
- Visual focus indicator
- Proper checked state announced

**WCAG:** 4.1.2 Name, Role, Value (Level A) ✅

---

### 5. Form Wrapper Components

#### `<FormField>`
Wrapper for form field grouping.

```tsx
<FormField>
  <FormLabel htmlFor="name" required>Name</FormLabel>
  <Input id="name" />
  <FormDescription>Your full name</FormDescription>
  <FormMessage error>{errorMsg}</FormMessage>
</FormField>
```

#### `<FormLabel>`
Enhanced label with required indicator.

```tsx
<FormLabel htmlFor="email" required>
  Email Address
</FormLabel>
// Renders: Email Address *
// Screen reader: "Email Address, required"
```

#### `<FormDescription>`
Help text for form fields.

```tsx
<FormDescription id="email-help">
  We'll never share your email
</FormDescription>
<Input
  id="email"
  aria-describedby="email-help"
/>
```

#### `<FormMessage>`
Error or info messages with proper announcements.

```tsx
<FormMessage id="email-error" error>
  Email is required
</FormMessage>
// Automatically gets role="alert" for errors
```

**WCAG:**
- 3.3.1 Error Identification (Level A) ✅
- 3.3.3 Error Suggestion (Level AA) ✅
- 4.1.3 Status Messages (Level AA) ✅

---

## Complete Example

```tsx
import {
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
  Input,
  Button,
} from "@kingly/ui/components";

function MyForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const emailId = React.useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      document.getElementById(emailId)?.focus();
      return;
    }
    // Submit form...
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel htmlFor={emailId} required>
          Email Address
        </FormLabel>
        <FormDescription id={`${emailId}-help`}>
          We'll use this for account recovery
        </FormDescription>
        <Input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={
            error ? `${emailId}-error` : `${emailId}-help`
          }
          aria-invalid={!!error}
          aria-required="true"
          error={!!error}
          required
        />
        <FormMessage id={`${emailId}-error`} error>
          {error}
        </FormMessage>
      </FormField>
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## Accessibility Checklist

When creating forms, ensure:

- [ ] Every input has an associated `<Label>` with matching `htmlFor`/`id`
- [ ] Required fields have `required` prop AND visual indicator
- [ ] Error messages use `aria-describedby` to link to input
- [ ] Error inputs have `aria-invalid="true"`
- [ ] Help text uses `aria-describedby` to link to input
- [ ] Use `React.useId()` for unique IDs
- [ ] Focus moves to first error on submit
- [ ] Success messages use `role="status"` with `aria-live="polite"`
- [ ] All inputs keyboard accessible (Tab/Enter/Space)
- [ ] Character limits shown for textareas
- [ ] Submit buttons have clear, descriptive text

---

## Testing

```bash
# Run Storybook with a11y addon (already installed)
cd packages/ui
pnpm storybook

# Check the a11y tab in Storybook for violations
```

---

## Resources

- **Full Audit Report:** `/docs/testing/ada-audit-report.md`
- **Example Form:** `/packages/ui/src/examples/accessible-form-example.tsx`
- **Radix UI Docs:** https://www.radix-ui.com/
- **ARIA Patterns:** https://www.w3.org/WAI/ARIA/apg/patterns/

---

## Migration Guide

### Before (Non-Accessible)
```tsx
<div>
  <span>Name</span>
  <input type="text" placeholder="Enter name" />
</div>
```

### After (Accessible)
```tsx
<FormField>
  <FormLabel htmlFor="name" required>Name</FormLabel>
  <Input
    id="name"
    type="text"
    placeholder="Enter name"
    aria-required="true"
    required
  />
</FormField>
```

---

**Note:** These components are styled with your SKYNET theme and will automatically match your dark mode design. All components support the same CSS utilities and className overrides as your other UI components.


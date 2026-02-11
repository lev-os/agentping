# packages/ui TODO

## Accessibility (ADA)

### Completed (da2ea530)
- [x] badge: semantic element, ARIA role/label
- [x] button: aria-disabled, icon-only JSDoc
- [x] card: type fix, semantic `as` prop
- [x] checkbox: Radix handles (docs needed)
- [x] dialog: close button aria-label
- [x] filtered-dropdown: dialog role, aria-modal, listbox role
- [x] form: useFormField hook, ID generation
- [x] input: aria-describedby, visual error indicator
- [x] label: Radix handles
- [x] progress: aria-valuemin/max/now
- [x] switch: Radix handles
- [x] textarea: resize-y, aria-describedby

### Remaining
- [ ] **Color contrast audit** - verify all variants meet WCAG AA (4.5:1)
- [ ] **Focus trap** - filtered-dropdown overlay needs focus trap (use `@radix-ui/react-focus-scope`)
- [ ] **Screen reader testing** - manual test with VoiceOver/NVDA
- [ ] **axe-core tests** - add `@axe-core/react` or `jest-axe` to test suite
- [ ] **ESLint a11y** - add `eslint-plugin-jsx-a11y` to lint config

## Code Quality

- [ ] **Storybook a11y panel** - run `pnpm storybook` and check Accessibility tab
- [ ] **Extract CVA variants** - button/badge have long className strings (optional, works fine)
- [ ] **JSDoc coverage** - add usage examples to all exported components

## New Components (if needed)
- [ ] `CheckboxWithLabel` - compound component pattern
- [ ] `RadioGroup` - accessible radio buttons (use Radix)
- [ ] `Select` - accessible select (use Radix, already in deps)
- [ ] `Tooltip` - accessible tooltip (use Radix, already in deps)

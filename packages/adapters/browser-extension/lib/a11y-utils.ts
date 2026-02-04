/**
 * AgentPing Accessibility Utilities
 *
 * Focus management, screen reader support, and keyboard navigation utilities.
 * Ensures ADA compliance for notification UIs.
 */

// ============================================================================
// Focus Trap
// ============================================================================

/**
 * Manages focus within a container element, preventing focus from escaping.
 * Essential for modal dialogs to ensure keyboard users can't tab outside.
 */
export class FocusTrap {
  private container: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private isActive = false;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Get all focusable elements within the container
   */
  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(this.container.querySelectorAll<HTMLElement>(selector));
  }

  /**
   * Handle keydown events for tab trapping
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.container.getRootNode() instanceof ShadowRoot
      ? (this.container.getRootNode() as ShadowRoot).activeElement
      : document.activeElement;

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (active === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /**
   * Activate the focus trap
   */
  activate(): void {
    if (this.isActive) return;

    // Store the currently focused element
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Add event listener
    this.container.addEventListener('keydown', this.boundHandleKeyDown);

    // Focus the first focusable element
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    this.isActive = true;
  }

  /**
   * Deactivate the focus trap and restore previous focus
   */
  deactivate(): void {
    if (!this.isActive) return;

    this.container.removeEventListener('keydown', this.boundHandleKeyDown);

    // Restore focus to the previously focused element
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      this.previouslyFocused.focus();
    }

    this.previouslyFocused = null;
    this.isActive = false;
  }

  /**
   * Check if focus trap is currently active
   */
  get active(): boolean {
    return this.isActive;
  }
}

// ============================================================================
// Screen Reader Announcements
// ============================================================================

/**
 * Manages screen reader announcements via ARIA live regions.
 * Creates an off-screen live region for dynamic announcements.
 */
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement;
  private shadow: ShadowRoot | null;

  constructor(shadow?: ShadowRoot) {
    this.shadow = shadow || null;
    this.liveRegion = this.createLiveRegion();
  }

  /**
   * Create the ARIA live region element
   */
  private createLiveRegion(): HTMLElement {
    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');

    // Visually hidden but accessible to screen readers
    region.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;

    if (this.shadow) {
      this.shadow.appendChild(region);
    } else {
      document.body.appendChild(region);
    }

    return region;
  }

  /**
   * Announce a message to screen readers (polite)
   * Polite announcements wait for the current speech to finish
   */
  announce(message: string): void {
    this.liveRegion.setAttribute('aria-live', 'polite');
    // Clear and re-set to trigger announcement
    this.liveRegion.textContent = '';
    // Use setTimeout to ensure the DOM change is detected
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Announce an urgent message to screen readers (assertive)
   * Assertive announcements interrupt current speech
   */
  announceUrgent(message: string): void {
    this.liveRegion.setAttribute('aria-live', 'assertive');
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Clean up the live region
   */
  destroy(): void {
    this.liveRegion.remove();
  }
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

export interface KeyboardShortcut {
  key: string;
  handler: () => void;
  description: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

/**
 * Manages keyboard shortcuts for a component
 */
export class KeyboardManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private container: HTMLElement | ShadowRoot | Document;
  private boundHandleKeyDown: (e: Event) => void;
  private isEnabled = true;

  constructor(container: HTMLElement | ShadowRoot | Document = document) {
    this.container = container;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.attach();
  }

  /**
   * Generate a unique key for a shortcut
   */
  private getShortcutKey(key: string, modifiers?: KeyboardShortcut['modifiers']): string {
    const parts: string[] = [];
    if (modifiers?.ctrl) parts.push('ctrl');
    if (modifiers?.alt) parts.push('alt');
    if (modifiers?.shift) parts.push('shift');
    if (modifiers?.meta) parts.push('meta');
    parts.push(key.toLowerCase());
    return parts.join('+');
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(e: Event): void {
    if (!this.isEnabled) return;

    const event = e as KeyboardEvent;
    const shortcutKey = this.getShortcutKey(event.key, {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    });

    const shortcut = this.shortcuts.get(shortcutKey);
    if (shortcut) {
      event.preventDefault();
      shortcut.handler();
    }
  }

  /**
   * Register a keyboard shortcut
   */
  register(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut.key, shortcut.modifiers);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(key: string, modifiers?: KeyboardShortcut['modifiers']): void {
    const shortcutKey = this.getShortcutKey(key, modifiers);
    this.shortcuts.delete(shortcutKey);
  }

  /**
   * Enable keyboard shortcuts
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable keyboard shortcuts
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Attach event listeners
   */
  attach(): void {
    this.container.addEventListener('keydown', this.boundHandleKeyDown);
  }

  /**
   * Detach event listeners
   */
  detach(): void {
    this.container.removeEventListener('keydown', this.boundHandleKeyDown);
  }

  /**
   * Get all registered shortcuts for help display
   */
  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }
}

// ============================================================================
// ARIA Helpers
// ============================================================================

/**
 * Set ARIA attributes for a dialog element
 */
export function setDialogAttributes(
  element: HTMLElement,
  options: {
    labelledBy?: string;
    describedBy?: string;
    modal?: boolean;
  } = {}
): void {
  element.setAttribute('role', 'dialog');

  if (options.modal) {
    element.setAttribute('aria-modal', 'true');
  }

  if (options.labelledBy) {
    element.setAttribute('aria-labelledby', options.labelledBy);
  }

  if (options.describedBy) {
    element.setAttribute('aria-describedby', options.describedBy);
  }
}

/**
 * Set ARIA attributes for a button element
 */
export function setButtonAttributes(
  element: HTMLElement,
  options: {
    label?: string;
    pressed?: boolean;
    expanded?: boolean;
    controls?: string;
    describedBy?: string;
  } = {}
): void {
  if (options.label) {
    element.setAttribute('aria-label', options.label);
  }

  if (options.pressed !== undefined) {
    element.setAttribute('aria-pressed', String(options.pressed));
  }

  if (options.expanded !== undefined) {
    element.setAttribute('aria-expanded', String(options.expanded));
  }

  if (options.controls) {
    element.setAttribute('aria-controls', options.controls);
  }

  if (options.describedBy) {
    element.setAttribute('aria-describedby', options.describedBy);
  }
}

/**
 * Generate a unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'ap'): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================================
// Reduced Motion
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate animation duration based on user preferences
 */
export function getAnimationDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

// ============================================================================
// High Contrast Mode
// ============================================================================

/**
 * Check if user has high contrast mode enabled
 */
export function prefersHighContrast(): boolean {
  return (
    window.matchMedia('(prefers-contrast: more)').matches ||
    window.matchMedia('(-ms-high-contrast: active)').matches
  );
}

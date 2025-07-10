# GitHub Copilot Instructions - React Native Project

## Project Context
React Native + Expo app with TypeScript, Jest unit testing, and Detox E2E testing.

## Code Generation Guidelines

### Components
- Use TypeScript with proper interfaces for props
- Add `testID` to all interactive elements for E2E testing
- Use `ThemedText` and `ThemedView` from existing components
- Create StyleSheet.create() for styles
- Include accessibility props (accessibilityLabel, accessibilityHint)

### File Structure
- Components: `/components/ComponentName.tsx`
- Unit tests: `/components/ComponentName.test.tsx`
- E2E tests: `/e2e/component-name.test.js`
- Screens: `/app/(tabs)/screen-name.tsx`

### Testing Requirements
- Every component needs unit tests with React Testing Library
- Use descriptive testIDs: `component-element-purpose`
- E2E tests should use Detox syntax with proper selectors
- Mock external dependencies in tests

### TypeScript Standards
- Define interfaces for all props
- Avoid `any` types
- Use proper typing for event handlers and state

### React Native Best Practices
- Use hooks (useState, useEffect, useThemeColor)
- Handle cross-platform differences (iOS/Android/Web)
- Implement proper error handling with try/catch
- Use KeyboardAvoidingView for forms
- Add loading states for async operations

### Example Component Structure
```typescript
interface Props {
  title: string;
  onPress: () => void;
}

export function MyComponent({ title, onPress }: Props) {
  return (
    <ThemedView testID="my-component-container">
      <ThemedText testID="my-component-title">{title}</ThemedText>
      <TouchableOpacity 
        testID="my-component-button"
        onPress={onPress}
        accessibilityLabel="Action button"
      >
        <ThemedText>Press me</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
```

### Common Patterns
- Form validation with clear error messages
- Loading states with ActivityIndicator
- Proper keyboard handling
- Theme-aware styling with useThemeColor
- Cross-platform compatibility

## Priority Order
1. **Functionality** - Code that works correctly
2. **Testing** - Proper testIDs and test coverage
3. **TypeScript** - Strong typing without any
4. **Accessibility** - Screen reader friendly
5. **Performance** - Optimized rendering
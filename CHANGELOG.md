# Changelog

All notable changes to the Savings & Deposit Calculator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- WCAG 2.1 AA accessibility compliance
- Screen reader support with ARIA labels and live regions
- Keyboard navigation support
- High contrast mode compatibility
- Error announcements for screen readers
- Focus management improvements
- CONTRIBUTING.md with development guidelines
- CHANGELOG.md for version tracking
- Comprehensive documentation structure in `/docs`
- LiveRegion component for accessibility announcements
- Input validation with real-time feedback
- Currency formatting with thousand separators ($10,000.00)
- Percentage formatting for interest rates (5.50%)
- Input masking to prevent invalid characters
- Paste handling that strips non-numeric characters
- Helpful placeholder text with examples
- FormattedNumberInput component for enhanced input handling

### Changed
- Updated README.md with accurate project information
- Improved file structure documentation
- Enhanced tech stack details with specific versions
- Updated Git repository URL references
- Reorganized documentation with active and archived sections
- Replaced basic number inputs with formatted inputs
- Updated field labels to be more user-friendly
- Enhanced help text with formatted examples
- Improved validation error messages for clarity

### Fixed
- GitHub issue template now correctly references IMPROVEMENTS-V2.md
- Corrected repository URL in installation instructions

## [1.1.0] - 2024-12-15

### Added
- Comprehensive unit test suite with Vitest
- E2E testing framework with Playwright
- Factory pattern for domain value objects
- Branded types for type safety
- Error boundary for graceful error handling
- Validation for all input fields
- Custom hook pattern (useCalculator)
- Test IDs for E2E testing

### Changed
- Migrated to TypeScript 5.8.3
- Updated to React 19.1.0
- Switched build tool to Vite 7.0.3
- Implemented Tailwind CSS 4.1.11
- Refactored to feature-based architecture
- Separated business logic from UI components

### Security
- Input validation prevents XSS attacks
- No external API calls or data transmission
- All calculations performed client-side

## [1.0.0] - 2024-11-01

### Initial Release
- Basic compound interest calculator
- Support for monthly, quarterly, annual, and at-maturity compounding
- Principal amount range: $1 - $10,000,000
- Interest rate range: 0.00% - 15.00%
- Investment term: 3 - 60 months
- Month-by-month breakdown display
- Real-time calculation updates
- Responsive design for mobile and desktop

[Unreleased]: https://github.com/maysam-tayyeb/term-deposits-ai-enhanced/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/maysam-tayyeb/term-deposits-ai-enhanced/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/maysam-tayyeb/term-deposits-ai-enhanced/releases/tag/v1.0.0
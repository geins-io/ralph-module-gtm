# CHANGELOG

## Version 3.5.0 (2023-12-14)

### Added

- First name, last name data to purchase event

## Version 3.4.0 (2023-10-13)

### Added

- Setting a HttpOnly cookie called `ralph-gtm-user` to identify the user, this is pushed to GTM as `ralph_user` with the `original_location` event
- Introduced a `CHANGELOG.md` file

### Changed

- `autoInit` is now set to `false` by default. GTM will init after the `original_location` event is pushed to the dataLayer.

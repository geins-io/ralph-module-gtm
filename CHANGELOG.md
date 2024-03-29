# CHANGELOG

## Version 3.7.0 (2024-03-14)

### Changed

- Module size optimization: Replaced crypto-js with the new js-sha256 npm package for sha256 encoding, significantly reducing the package size.

## Version 3.6.0 (2024-01-10)

### Added

- Zip code data added to purchase event

## Version 3.5.0 (2023-12-14)

### Added

- First name, last name, country code data added to purchase event

## Version 3.4.0 (2023-10-13)

### Added

- Setting a HttpOnly cookie called `ralph-gtm-user` to identify the user, this is pushed to GTM as `ralph_user` with the `original_location` event
- Introduced a `CHANGELOG.md` file

### Changed

- `autoInit` is now set to `false` by default. GTM will init after the `original_location` event is pushed to the dataLayer.

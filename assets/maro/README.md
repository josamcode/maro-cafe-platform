# MARO asset library

Collected on September 27, 2026. Open [the visual catalog](index.html) to browse, filter, download and inspect source links.

## Collection

- 60 Facebook images downloaded from the photo viewer, including the profile logo and cover. These are the largest versions captured, not camera or editable originals.
- 2 additional Facebook gallery previews, retained as low-resolution references.
- 42 Instagram post/reel covers. These are still images, not 42 video downloads.
- 2 website logo images, 5 promotional designs, 3 MP4 videos and the Talabat partner mark.
- 1 promotional image from Google Maps, labelled as a reference.
- 126 menu items across 6 categories, with 198 price options in EGP.

Total: 116 media files, approximately 105 MiB. This is a collection of accessible public material, not a complete export of the accounts. Different files can depict the same artwork.

## Files

| Location                        | Contents                                                       |
| ------------------------------- | -------------------------------------------------------------- |
| `brand/`                        | Website logo variants and Facebook branding                    |
| `social/facebook/full-size/`    | Larger Facebook photo downloads                                |
| `social/facebook/previews/`     | Two small references                                           |
| `social/instagram/`             | Post and reel covers                                           |
| `offers/`                       | Website promotional graphics                                   |
| `video/`                        | Three website MP4 files                                        |
| `reference/`                    | Partner mark and Maps promotional reference                    |
| `metadata/menu.json`            | English menu, sizes and source-listed prices                   |
| `metadata/branches.json`        | Branch details and conflicting address evidence                |
| `metadata/offers.json`          | Promotional prices, separate from regular menu data            |
| `metadata/brand-reference.json` | Existing website palette, fonts and official links             |
| `metadata/asset-manifest.json`  | File paths, dimensions, sizes, SHA-256 hashes and source pages |

## Useful starting points

Use the PNG logo for initial mockups, the larger Facebook photos for product and venue imagery, and the website videos for motion exploration. Social graphics help establish the existing visual language; they are not substitutes for clean product photography. The catalog preserves images without cropping, enhancement or upscaling.

All authored metadata and documentation is in English. Original artwork retains its original language.

## Confirm before launch

- Main Haram is listed as **427** on the website/Facebook and **430** on Google Maps. Preserve the discrepancy until MARO confirms the address.
- Menu prices and offers are unverified. The Maps coffee graphic advertises EGP 15; its drink type, size and validity are unknown. Do not publish it as a current menu price.
- Serving volumes, branch availability, opening hours and product names need confirmation. The source places “Avocado” under Hot Coffee; this may be a transcription issue.
- Google Maps showed 4.7 from 12 reviews during collection. That is a dated snapshot, not a permanent marketing claim.
- The Maps artwork was uploaded by Mrwan Ayman. Its inclusion is for reference; permission to republish has not been established. Confirm rights for externally credited photography, people and video audio before public use.
- The Talabat logo is a partner mark, not part of MARO's identity.

## Not obtained

Editable logo/design sources (SVG, AI, PSD), the original menu PDF mentioned in the website script, clean photography for every menu item, every Instagram carousel frame, all reels/highlight videos, and a complete social account export. Instagram displayed 47 posts; 42 covers were captured. TikTok and Talabat links were recorded but their libraries were not archived.

## Sources and maintenance

- [Website](https://maro-cafe-3.vercel.app/)
- [Facebook](https://www.facebook.com/Marocaffe7/)
- [Instagram](https://www.instagram.com/maro_mini_cafe/)
- [Supplied Google Maps listing](https://maps.app.goo.gl/7dMZ25kGE4Evoz8i7)

The library lives outside application public folders. Select and optimize approved assets when implementing the experience; avoid shipping the entire archive.

`node scripts/collect-maro-public-assets.mjs` refreshes website assets and menu data using public source parsed as literals, without executing downloaded JavaScript. Social files were collected through the rendered browser. After updating the consolidated manifest, `node scripts/build-maro-asset-catalog.mjs` rebuilds the offline catalog.

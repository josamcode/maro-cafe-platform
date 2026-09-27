# Menu photography for development

September 27, 2026. The user explicitly approved repeating illustrative images while the site is under development. This supersedes the previous decision to omit product images until every SKU could be matched.

The menu now shows category thumbnails, product photographs and an image inside each product detail dialog. Desktop cards use a landscape photograph; mobile cards use a compact portrait thumbnail beside the name, price and action. The whole card remains clickable. Images use Next Image sizing and lazy loading; a failed image falls back to the existing MARO atmosphere photograph.

## Central mapping

Image references, bilingual alt text, source and verification status now live in the shared database/API catalog. `/admin` supports choosing existing images, uploading new photos and explicitly confirming product matches. The original item/category mapping is archived in `scripts/catalog-source/media.ts` for initial import. `features/menu/media.ts` only exposes the shared media type; card and dialog components require no content-specific edits.

| Use                                    | Public file                     | Source Facebook photo ID | Status                                                |
| -------------------------------------- | ------------------------------- | ------------------------ | ----------------------------------------------------- |
| Hot drinks and hot coffee fallback     | `/home/coffee-moment.jpg`       | 969136968765833          | Temporary category reference                          |
| Iced coffee fallback                   | `/home/iced-coffee.jpg`         | 1077973387882190         | Temporary category reference                          |
| Milkshake fallback                     | `/home/milkshake.jpg`           | 1077974971215365         | Temporary category reference                          |
| Fresh and soft drinks fallback         | `/menu/chilled-drinks.jpg`      | 1078581087821420         | Temporary chilled-drink reference                     |
| Strawberry matcha candidate (`iced-7`) | `/menu/strawberry-matcha.jpg`   | 1080510667628462         | Visual candidate; recipe identity awaits confirmation |
| Iced chocolate candidate (`iced-10`)   | `/design-system/maro-drink.jpg` | 1078060874540108         | Visual candidate; recipe identity awaits confirmation |

The two new public files are unmodified copies from the collected Facebook archive. Existing public files are reused directly. No generated photographs were needed for this pass. None of these mappings is promoted to verified SKU photography solely because the image looks plausible. Generic references intentionally repeat, including across different flavours and bottled drinks, as authorized for development.

The menu includes one quiet bilingual reference-image note, and each unverified detail photograph has a short caption. Source or implementation metadata is not placed on individual product cards. Actual ingredient, stock and price claims remain unchanged.

## Replacement before launch

Confirm the product identity and serving presentation with MARO, replace the relevant item mapping with the correct photo, then mark it verified. Verify all flavours, packaged drinks and hot teas; these currently inherit broad illustrative references. Final publication needs approved assets and menu data. The original archive and catalog snapshot are unchanged.

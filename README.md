# Pattern Matcha

This is a library that compiles a collection of useful regex patterns to be able to format texts in English and Arabic in a consistent manner.

This is useful for translators that want to be able to produce consistent looking translations with their original source texts in various lifecycles of any given text.

At the moment there are three phases for formatting:

1. onPaste: These are formatting one wants to apply to a text when a text is pasted into a input field. Generally these are preformatting rules.
2. onBlur: These are the formatting one wants to apply to a text anytime a text field containing the text is unfocused (ie: the blur event).
3. onSanitize: These are formatting one wants to apply during a sanitization phase, generally saves or querying and normalization of text so that an app can eliminate noise such as diacritics from the text.

## Table of Contents

1. [Installation](#installation)
2. [API Usage](#api-usage)
    - [getArabicRules](#getarabicrules)
    - [getEnglishRules](#getenglishrules)
    - [getArabicFormattingRules](#getarabicformattingrules)
    - [getArabicSanitizingRules](#getarabicsanitizingrules)
    - [getEnglishOnBlurRules](#getenglishonblurrules)
    - [getArabicOnBlurRules](#getarabiconblurrules)
    - [getArabicOnPasteRules](#getarabiconpasterules)
    - [getEnglishOnPasteRules](#getenglishonpasterules)
    - [getArabicOnSanitizeRules](#getarabiconsanitizerules)
    - [getRulesByName](#getrulesbyname)
3. [Performance Considerations](#performance-considerations)
4. [License](#license)

## Installation

To install Pattern Matcha, use npm:

```bash
npm install pattern-matcha
```

## API Usage

### getArabicRules

Returns a `Rules` object with rules applicable for Arabic text formatting.

```javascript
import { getArabicRules } from 'pattern-matcha';

const arabicRules = getArabicRules();
```

### getEnglishRules

Returns a `Rules` object with rules applicable for English text formatting.

```javascript
import { getEnglishRules } from 'pattern-matcha';

const englishRules = getEnglishRules();
```

### getArabicFormattingRules

Retrieves rules for Arabic text formatting, specifically for scenarios where text is pasted or loses focus.

```javascript
import { getArabicFormattingRules } from 'pattern-matcha';

const formattingRules = getArabicFormattingRules();
```

### getArabicSanitizingRules

Retrieves rules for sanitizing Arabic text.

```javascript
import { getArabicSanitizingRules } from 'pattern-matcha';

const sanitizingRules = getArabicSanitizingRules();
```

### getEnglishOnBlurRules

Retrieves rules for English text formatting typically on `onBlur` events.

```javascript
import { getEnglishOnBlurRules } from 'pattern-matcha';

const onBlurRules = getEnglishOnBlurRules();
```

### getArabicOnBlurRules

Retrieves rules for Arabic text formatting on `onBlur` events.

```javascript
import { getArabicOnBlurRules } from 'pattern-matcha';

const arabicOnBlurRules = getArabicOnBlurRules();
```

### getArabicOnPasteRules

Retrieves rules for Arabic text formatting on `onPaste` events.

```javascript
import { getArabicOnPasteRules } from 'pattern-matcha';

const arabicOnPasteRules = getArabicOnPasteRules();
```

### getEnglishOnPasteRules

Retrieves rules for English text formatting on `onPaste` events.

```javascript
import { getEnglishOnPasteRules } from 'pattern-matcha';

const englishOnPasteRules = getEnglishOnPasteRules();
```

### getArabicOnSanitizeRules

Retrieves rules for Arabic text formatting on `onSanitize` events.

```javascript
import { getArabicOnSanitizeRules } from 'pattern-matcha';

const arabicOnSanitizeRules = getArabicOnSanitizeRules();
```

### getRulesByName

Returns a new `Rules` object containing rules specified by their names.

```javascript
import { getRulesByName } from 'pattern-matcha';

const specificRules = getRulesByName('applySmartQuotes', 'cleanSpacesBeforePeriod');
```

## Performance Considerations

-   **Regex Complexity**: Given the reliance on regular expressions, performance may vary based on the complexity and length of the patterns and the text being processed. Complex regex patterns can lead to increased time complexity, particularly for longer texts.
-   **Number of Rules**: The runtime complexity increases with the number of rules being applied, as each rule implies a separate scan of the text.
-   **Text Length**: Longer texts will naturally take more time to process as each rule needs to be applied across the entire text body.

## License

Pattern Matcha is [MIT licensed](https://github.com/ragaeeb/pattern-matcha/blob/master/LICENSE).

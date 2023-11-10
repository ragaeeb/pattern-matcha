import rulesData from './regexRules.json';

const rules = rulesData.map(({ flags, pattern, ...rule }) => ({
    regex: new RegExp(pattern, flags),
    ...rule,
}));

class Rules {
    /**
     * The raw compiled rules loaded from JSON.
     * @param {*} compiledRules The raw rules with the patterns compiled into RegExp objects.
     */
    constructor(compiledRules) {
        this.rules = compiledRules;
    }

    /**
     * Adds the rules from the given Rules object to this one.
     * @param {*} newRules Another Rules object.
     * @returns This rules object with the other rules appended.
     */
    add(newRules) {
        this.rules.push(...newRules.rules);
        return this;
    }

    /**
     * Returns a copy of this rules object after applying the given filter function on its current set of rules
     * @param {*} f The function to filter out the rules we want to keep.
     * @returns A copy of this rules object while only keeping the rules that were allowed by the filter.
     */
    filter(f) {
        this.rules = this.rules.filter(f);
        return this;
    }

    /**
     * Formats a given text string by applying the compiled rules.
     * Each rule is a regex pattern that is searched in the text, and if found, replaced with its respective substitution.
     * @param text The text to be formatted.
     * @param options Optional parameter for logging during the format operation.
     * @returns The formatted text.
     */
    format(text, { logger } = {}) {
        let modifiedText = text;

        if (logger) {
            logger(`format::Original ${modifiedText}`);
        }

        for (let i = 0; i < this.rules.length; i += 1) {
            const rule = this.rules[i];
            modifiedText = modifiedText.replace(rule.regex, rule.replacement);

            if (logger) {
                logger(`format::After (id,name)=(${rule.id},${rule.name}): ${modifiedText}`);
            }
        }

        return modifiedText;
    }
}

const getFilteredRules = (filter) => {
    const filtered = rules.filter(filter);
    return new Rules(filtered);
};

/**
 * Returns a Rules object with rules applicable for Arabic text formatting.
 * @returns Rules object tailored for Arabic text.
 */
export const getArabicRules = () => getFilteredRules((r) => r.arabic);

/**
 * Returns a new Rules object containing rules specified by their names.
 * @param names Names of the rules to include in the returned Rules object.
 * @returns Rules object containing the specified rules.
 */
export const getRulesByName = (...names) => new Rules(rules.filter(({ name }) => names.includes(name)));

/**
 * Retrieves rules for Arabic text formatting on onBlur events.
 * @returns Rules object containing onBlur rules for Arabic text.
 */
export const getArabicOnBlurRules = () => getArabicRules().filter((r) => r.onBlur);

/**
 * Retrieves rules for Arabic text formatting on onPaste events.
 * @returns Rules object containing onPaste rules for Arabic text.
 */
export const getArabicOnPasteRules = () => getArabicRules().filter((r) => r.onPaste);

/**
 * Retrieves rules for Arabic text formatting on onSanitize events.
 * @returns Rules object containing onSanitize rules for Arabic text.
 */
export const getArabicOnSanitizeRules = () => getArabicRules().filter((r) => r.onSanitize);

/**
 * Retrieves rules for Arabic text formatting, specifically for scenarios where text is pasted or loses focus.
 * @returns Rules object containing formatting rules for Arabic text in onPaste and onBlur events.
 */
export const getArabicFormattingRules = () => getArabicOnPasteRules().add(getArabicOnBlurRules());

/**
 * Retrieves rules for sanitizing Arabic text.
 * @returns Rules object containing sanitization rules for Arabic text.
 */
export const getArabicSanitizingRules = () => getArabicFormattingRules().add(getArabicOnSanitizeRules());

/**
 * Returns a Rules object with rules applicable for English text formatting.
 * @returns Rules object tailored for English text.
 */
export const getEnglishRules = () => getFilteredRules((r) => r.english);

/**
 * Retrieves rules for English text formatting on onBlur events.
 * @returns Rules object containing onBlur rules for English text.
 */
export const getEnglishOnBlurRules = () => getEnglishRules().filter((r) => r.onBlur);

/**
 * Retrieves rules for English text formatting on onPaste events.
 * @returns Rules object containing onPaste rules for English text.
 */
export const getEnglishOnPasteRules = () => getEnglishRules().filter((r) => r.onPaste);

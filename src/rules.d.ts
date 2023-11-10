import { ReadStream } from 'fs';

/**
 * Interface for a rule used in text formatting and sanitization.
 * Each rule consists of a regex pattern for searching text, a replacement string,
 * flags for the regex, and additional properties to indicate when the rule should be applied.
 */
interface Rule {
    /** A unique identifier for a specific rule. */
    id: number;

    /** A non-unique name for the rule. If a set of rules should always be applied in order they should share the same name, and have unique IDs ordered to reflect which rule occurs before the other. */
    name: string;
    replacement: string;
    regex: RegExp;
    // Additional properties indicating the rule's applicability in various scenarios
    onSanitize?: number;
    onPaste?: boolean;
    onBlur?: boolean;
    arabic?: boolean;
    english?: boolean;
}

/**
 * Represents a collection of rules that can be applied to format text.
 */
declare class Rules {
        /**
     * The raw compiled rules loaded from JSON.
     * @param {*} compiledRules The raw rules with the patterns compiled into RegExp objects.
     */
    constructor(compiledRules: Rule[]);

    /**
     * Adds the rules from the given Rules object to this one.
     * @param {*} newRules Another Rules object.
     * @returns This rules object with the other rules appended.
     */
    add(newRules: Rules): Rules;

    /**
     * Returns a copy of this rules object after applying the given filter function on its current set of rules
     * @param {*} f The function to filter out the rules we want to keep.
     * @returns A copy of this rules object while only keeping the rules that were allowed by the filter.
     */
    filter(f): Rules;

    /**
     * Formats a given text string by applying the compiled rules.
     * Each rule is a regex pattern that is searched in the text, and if found, replaced with its respective substitution.
     * @param text The text to be formatted.
     * @param options Optional parameter for logging during the format operation.
     * @returns The formatted text.
     */
    format(text: string, options?: { logger?: (msg: string) => void }): string;
}

/**
 * Returns a Rules object with rules applicable for Arabic text formatting.
 * @returns Rules object tailored for Arabic text.
 */
export function getArabicRules(): Rules;

/**
 * Returns a Rules object with rules applicable for English text formatting.
 * @returns Rules object tailored for English text.
 */
export function getEnglishRules(): Rules;

/**
 * Retrieves rules for Arabic text formatting, specifically for scenarios where text is pasted or loses focus.
 * @returns Rules object containing formatting rules for Arabic text in onPaste and onBlur events.
 */
export function getArabicFormattingRules(): Rules;

/**
 * Retrieves rules for sanitizing Arabic text.
 * @returns Rules object containing sanitization rules for Arabic text.
 */
export function getArabicSanitizingRules(): Rules;

/**
 * Retrieves rules for English text formatting on onBlur events.
 * @returns Rules object containing onBlur rules for English text.
 */
export function getEnglishOnBlurRules(): Rules;

/**
 * Retrieves rules for Arabic text formatting on onBlur events.
 * @returns Rules object containing onBlur rules for Arabic text.
 */
export function getArabicOnBlurRules(): Rules;

/**
 * Retrieves rules for Arabic text formatting on onSanitize events.
 * @returns Rules object containing onSanitize rules for Arabic text.
 */
export function getArabicOnSanitizeRules(): Rules;

/**
 * Retrieves rules for English text formatting on onPaste events.
 * @returns Rules object containing onPaste rules for English text.
 */
export function getEnglishOnPasteRules(): Rules;

/**
 * Retrieves rules for Arabic text formatting on onPaste events.
 * @returns Rules object containing onPaste rules for Arabic text.
 */
export function getArabicOnPasteRules(): Rules;

/**
 * Returns a new Rules object containing rules specified by their names.
 * @param names Names of the rules to include in the returned Rules object.
 * @returns Rules object containing the specified rules.
 */
export function getRulesByName(...names: string[]): Rules;

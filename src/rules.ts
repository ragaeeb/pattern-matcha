import rulesData from '../dist/rules.json';

interface RawRule {
    id: number;
    name: string;
    pattern: string;
    replacement: string;
    flags: string;
    description?: string;
    arabic?: number;
    english?: number;
    onPaste?: number;
    onBlur?: number;
    onSanitize?: number;
    timestamp: string;
    last_updated: string;
}

interface CompiledRule extends Omit<RawRule, 'pattern' | 'flags'> {
    regex: RegExp;
}

export const compile = (rawRules: RawRule[]): CompiledRule[] =>
    rawRules.map(({ pattern, flags, ...rule }) => ({
        regex: new RegExp(pattern, flags),
        ...rule,
    }));

const rules = compile(rulesData as RawRule[]);

export class Rules {
    private _rules: CompiledRule[];

    constructor(compiledRules: CompiledRule[]) {
        this._rules = compiledRules;
    }

    add(newRules: Rules): this {
        this._rules.push(...newRules.rules);
        return this;
    }

    filter(f: (rule: CompiledRule) => boolean): this {
        this._rules = this._rules.filter(f);
        return this;
    }

    format(text: string, options: { logger?: (msg: string) => void } = {}): string {
        let modifiedText = text;

        const { logger } = options;
        if (logger) {
            logger(`format::Original ${modifiedText}`);
        }

        for (const rule of this._rules) {
            modifiedText = modifiedText.replace(rule.regex, rule.replacement);

            if (logger) {
                logger(`format::After (id,name)=(${rule.id},${rule.name}): ${modifiedText}`);
            }
        }

        return modifiedText;
    }

    // Getter function to access the rules
    public get rules(): CompiledRule[] {
        return this._rules;
    }
}

/**
 * Gets the rules based on the filter function specified.
 * @param filter A filter function to only return a subset of rules. Pass Boolean to get all the rules back.
 * @returns Returns the rules based on the filter.
 */
export const getFilteredRules = (filter: (rule: CompiledRule) => boolean): Rules => {
    const filtered = rules.filter(filter);
    return new Rules(filtered);
};

/**
 * Returns a Rules object with rules applicable for Arabic text formatting.
 * @returns Rules object tailored for Arabic text.
 */
export const getArabicRules = (): Rules => getFilteredRules((r) => !!r.arabic);

/**
 * Returns a new Rules object containing rules specified by their names.
 * @param names Names of the rules to include in the returned Rules object.
 * @returns Rules object containing the specified rules.
 */
export const getRulesByName = (...names: string[]): Rules =>
    new Rules(rules.filter(({ name }) => names.includes(name)));

/**
 * Retrieves rules for Arabic text formatting on onBlur events.
 * @returns Rules object containing onBlur rules for Arabic text.
 */
export const getArabicOnBlurRules = (): Rules => getArabicRules().filter((r) => !!r.onBlur);

/**
 * Retrieves rules for Arabic text formatting on onPaste events.
 * @returns Rules object containing onPaste rules for Arabic text.
 */
export const getArabicOnPasteRules = (): Rules => getArabicRules().filter((r) => !!r.onPaste);

/**
 * Retrieves rules for Arabic text formatting on onSanitize events.
 * @returns Rules object containing onSanitize rules for Arabic text.
 */
export const getArabicOnSanitizeRules = (): Rules => getArabicRules().filter((r) => !!r.onSanitize);

/**
 * Retrieves rules for Arabic text formatting, specifically for scenarios where text is pasted or loses focus.
 * @returns Rules object containing formatting rules for Arabic text in onPaste and onBlur events.
 */
export const getArabicFormattingRules = (): Rules => getArabicOnPasteRules().add(getArabicOnBlurRules());

/**
 * Retrieves rules for sanitizing Arabic text.
 * @returns Rules object containing sanitization rules for Arabic text.
 */
export const getArabicSanitizingRules = (): Rules => getArabicFormattingRules().add(getArabicOnSanitizeRules());

/**
 * Returns a Rules object with rules applicable for English text formatting.
 * @returns Rules object tailored for English text.
 */
export const getEnglishRules = (): Rules => getFilteredRules((r) => !!r.english);

/**
 * Retrieves rules for English text formatting on onBlur events.
 * @returns Rules object containing onBlur rules for English text.
 */
export const getEnglishOnBlurRules = (): Rules => getEnglishRules().filter((r) => !!r.onBlur);

/**
 * Retrieves rules for English text formatting on onPaste events.
 * @returns Rules object containing onPaste rules for English text.
 */
export const getEnglishOnPasteRules = (): Rules => getEnglishRules().filter((r) => !!r.onPaste);

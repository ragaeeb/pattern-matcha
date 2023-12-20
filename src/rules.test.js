import { beforeEach, describe, expect, it } from '@jest/globals';

import {
    getArabicOnBlurRules,
    getArabicOnPasteRules,
    getArabicOnSanitizeRules,
    getArabicRules,
    getEnglishOnBlurRules,
    getEnglishOnPasteRules,
    getEnglishRules,
    getRulesByName,
} from './rules';

describe('rules', () => {
    describe('getArabicRules', () => {
        it('should filter arabic ones', () => {
            expect(getArabicRules().rules.every((e) => e.arabic && e.regex && !e.pattern && !e.flags)).toBe(true);
        });
    });

    describe('getEnglishRules', () => {
        it('should filter English ones', () => {
            expect(getEnglishRules().rules.every((e) => e.english && e.regex && !e.pattern && !e.flags)).toBe(true);
        });
    });

    describe('getArabicOnBlurRules', () => {
        it('should retrieve all rules Arabic and that have onBlur', () => {
            expect(getArabicOnBlurRules().rules.every((e) => e.arabic && e.onBlur)).toBe(true);
        });
    });

    describe('getArabicOnPasteRules', () => {
        it('should retrieve all rules Arabic and that have onPaste', () => {
            expect(getArabicOnPasteRules().rules.every((e) => e.arabic && e.onPaste)).toBe(true);
        });
    });

    describe('getArabicOnSanitizeRules', () => {
        it('should retrieve all rules Arabic and that have onSanitize', () => {
            expect(getArabicOnSanitizeRules().rules.every((e) => e.arabic && e.onSanitize)).toBe(true);
        });
    });

    describe('getEnglishOnBlurRules', () => {
        it('should retrieve all rules English and that have onBlur', () => {
            expect(getEnglishOnBlurRules().rules.every((e) => e.english && e.onBlur)).toBe(true);
        });
    });

    describe('getEnglishOnPasteRules', () => {
        it('should retrieve all rules English and that have onBlur', () => {
            expect(getEnglishOnPasteRules().rules.every((e) => e.english && e.onPaste)).toBe(true);
        });
    });

    describe('getRulesByName', () => {
        it('should retrieve all rules specified', () => {
            const Rules = getRulesByName('foo', 'applySmartQuotes', 'condenseMultilines');
            expect(Rules.rules).toHaveLength(2);
        });
    });

    describe('format', () => {
        let rules;

        describe('applySmartQuotes', () => {
            beforeEach(() => {
                rules = getRulesByName('applySmartQuotes', 'applySmartQuotes2');
            });

            it('quotes', () => {
                expect(rules.format('The "quick brown" fox jumped "right" over the lazy dog.')).toEqual(
                    'The “quick brown” fox jumped “right” over the lazy dog.',
                );
            });

            it('no-op', () => {
                expect(rules.format('this is')).toEqual('this is');
            });
        });

        describe('al- replacements', () => {
            beforeEach(() => {
                rules = getRulesByName('al-prefix');
            });

            it('should replace all the al-s', () => {
                expect(
                    rules.format(
                        'Al-Rahman bar-Rahman becomes al-Rahman, and ar-Rahman becomes al-Rahman, and As-Sukkari and as-Sukkari both become al-Sukkari, and adh-Dhahabi and Adh-Dhahabi both turn to Al Dhahabi with Sufyan Ath Thawri',
                    ),
                ).toEqual(
                    'al-Rahman bar-Rahman becomes al-Rahman, and al-Rahman becomes al-Rahman, and al-Sukkari and al-Sukkari both become al-Sukkari, and al-Dhahabi and al-Dhahabi both turn to al-Dhahabi with Sufyan al-Thawri',
                );
            });

            it('should replace the az variations', () => {
                expect(rules.format('Az-Zuhri and Az Zuhri should both get formatted baz Baz B-Az')).toEqual(
                    'al-Zuhri and al-Zuhri should both get formatted baz Baz B-Az',
                );
            });

            it('should replace the Ats and Ad variations', () => {
                expect(rules.format('Ad-Ḏuhlī and Sufyān Ats-Thawrī')).toEqual('al-Ḏuhlī and Sufyān al-Thawrī');
            });

            it('should replace the ash variations', () => {
                expect(
                    rules.format(
                        'Ash-hadu an la ilaha should be intact but ash-Shafiee or Ash-Shafiee and Ash-Shaykh should be changed',
                    ),
                ).toEqual(
                    'Ash-hadu an la ilaha should be intact but al-Shafiee or al-Shafiee and al-Shaykh should be changed',
                );
            });
        });

        describe('reduceSpacesBeforePunctuation', () => {
            beforeEach(() => {
                rules = getRulesByName('cleanSpacesBeforePeriod');
            });

            it('removes the spaces for period', () => {
                expect(rules.format('This sentence has some space , before period  . Hello')).toEqual(
                    'This sentence has some space, before period. Hello',
                );
            });

            it('removes the spaces for question mark', () => {
                expect(rules.format('This sentence has some space before period  ؟ Hello')).toEqual(
                    'This sentence has some space before period؟ Hello',
                );

                expect(rules.format('الإسلام أم الكفر ؟')).toEqual('الإسلام أم الكفر؟');
            });

            it('removes the spaces for exclamation mark', () => {
                expect(rules.format('This sentence has some space before period  ! Hello')).toEqual(
                    'This sentence has some space before period! Hello',
                );
            });

            it('removes the spaces for semicolon', () => {
                expect(rules.format('ومن قال: (لا أعمل بحديث إلا إن أخذ به إمامي) ؛')).toEqual(
                    'ومن قال: (لا أعمل بحديث إلا إن أخذ به إمامي)؛',
                );
            });

            it('removes the spaces for comma', () => {
                expect(rules.format('This sentence has some space before period  ، Hello')).toEqual(
                    'This sentence has some space before period، Hello',
                );
            });

            it('no-op', () => {
                expect(rules.format('this is')).toEqual('this is');
            });
        });

        describe('reduceSpaceBetween part pages', () => {
            it('clean spaces between reference', () => {
                rules = getRulesByName('reduceSpaceBetweenReference');

                expect(rules.format('this is 127 / 11 with 127 /2 and 122 /3 and 22/1')).toEqual(
                    'this is 127/11 with 127/2 and 122/3 and 22/1',
                );
            });
        });

        describe('reduceSpaces', () => {
            beforeEach(() => {
                rules = getRulesByName('reduceSpaces');
            });

            it('removes the spaces', () => {
                expect(rules.format('This has    many spaces\n\nNext line')).toEqual(
                    'This has many spaces\n\nNext line',
                );
            });

            it('no-op', () => {
                expect(rules.format('this is')).toEqual('this is');
            });
        });

        describe('cleanMultilineSpaces', () => {
            beforeEach(() => {
                rules = getRulesByName('cleanMultilines');
            });

            it('removes the spaces', () => {
                expect(rules.format('This has    \nmany spaces  \n\nNext line')).toEqual(
                    'This has\nmany spaces\n\nNext line',
                );
            });

            it('no-op', () => {
                expect(rules.format('this is')).toEqual('this is');
            });
        });

        describe('condenseMultilines', () => {
            beforeEach(() => {
                rules = getRulesByName('condenseMultilines2');
            });

            it('should remove the multiple line breaks', () => {
                expect(rules.format('This\n\nis\n\n\nsome\nlines')).toEqual('This\nis\nsome\nlines');
            });
        });

        describe('fixSalutations', () => {
            beforeEach(() => {
                rules = getRulesByName('fixSalutations', 'fixSalutations2');
            });

            it('Messenger of Allah (*)', () => {
                expect(rules.format('Then the Messenger of Allah (sallahu alayhi wasallam) said')).toEqual(
                    'Then the Messenger of Allah ﷺ said',
                );
            });

            it('Messenger (*)', () => {
                expect(rules.format('Then the Messenger (sallahu alayhi wasallam) said')).toEqual(
                    'Then the Messenger ﷺ said',
                );
            });

            it('Messenger (peace*)', () => {
                expect(rules.format('Then the Messenger (peace and blessings be upon him) said')).toEqual(
                    'Then the Messenger ﷺ said',
                );
            });

            it('Messenger (May peace*)', () => {
                expect(rules.format(`Allah's Messenger (May peace and blessings be upon him) said`)).toEqual(
                    `Allah's Messenger ﷺ said`,
                );
            });

            it('Messenger (Prophet peace*)', () => {
                expect(rules.format(`Prophet (May peace and blessings be upon him) said`)).toEqual(`Prophet ﷺ said`);
            });

            it('Prophet (*)', () => {
                expect(rules.format('Then the Prophet (sallahu alayhi wasallam) said')).toEqual(
                    'Then the Prophet ﷺ said',
                );
            });

            it('Muhammad (*)', () => {
                expect(rules.format('Then Muhammad (sallahu alayhi wasallam) said')).toEqual('Then Muhammad ﷺ said');
            });

            it('Muḥammad (*)', () => {
                expect(rules.format('Then Muḥammad (sallahu alayhi wasallam) said')).toEqual('Then Muḥammad ﷺ said');
            });

            it('Must start with s', () => {
                expect(rules.format('Then Muḥammad (xsallahu alayhi wasallam) said')).toEqual(
                    'Then Muḥammad (xsallahu alayhi wasallam) said',
                );
            });

            it('Must end with m', () => {
                expect(rules.format('Then Muḥammad (sallahu alayhi wasalla) said')).toEqual(
                    'Then Muḥammad (sallahu alayhi wasalla) said',
                );
            });
        });

        describe('condenseAsterisks', () => {
            beforeEach(() => {
                rules = getRulesByName('condenseAsterisks');
            });

            it('should reduce the asterisks', () => {
                expect(rules.format('* * *')).toEqual('*');
            });
        });

        describe('doubleToSingleBrackets', () => {
            beforeEach(() => {
                rules = getRulesByName('doubleToSingleBrackets');
            });

            it('should reduce the brackets', () => {
                expect(rules.format('((text)) [[array]]')).toEqual('(text) [array]');
            });

            it('should reduce the brackets in the Arabic text', () => {
                expect(
                    rules.format(
                        'قال المؤلف رحمه الله تعالي: ((باب الإخلاص وإحضار النية، في جميع الأعمال والأقوال البارز والخفية))',
                    ),
                ).toEqual(
                    'قال المؤلف رحمه الله تعالي: (باب الإخلاص وإحضار النية، في جميع الأعمال والأقوال البارز والخفية)',
                );
            });

            it('should handle string with multiple double brackets', () => {
                const str = '((النية)) محلها القلب و ((العمل)) محله الفعل';
                const expected = '(النية) محلها القلب و (العمل) محله الفعل';
                expect(rules.format(str)).toBe(expected);
            });

            it('should handle nested double brackets', () => {
                const str = 'قال: ((هو ((العليم)) بكل شيء))';
                const expected = 'قال: (هو (العليم) بكل شيء)';
                expect(rules.format(str)).toBe(expected);
            });

            it('should handle string with no double brackets', () => {
                const str = 'الحمد لله رب العالمين';
                expect(rules.format(str)).toBe(str);
            });
        });

        describe('removeEnglishLettersAndSymbols', () => {
            beforeEach(() => {
                rules = getRulesByName('removeEnglishLettersAndSymbols');
            });

            it('should remove ampersand', () => {
                expect(rules.format(`أحب & لنفسي`)).toEqual('أحب   لنفسي');
            });
        });

        describe('removeTashkeel', () => {
            beforeEach(() => {
                rules = getRulesByName('removeTashkeel');
            });

            it('should remove tatweel', () => {
                expect(rules.format('أبـــتِـــكَةُ')).toEqual('أبتكة');
            });

            it('should remove tashkeel', () => {
                expect(rules.format('مُحَمَّدٌ')).toEqual('محمد');
            });
        });

        describe('removeNonIndexSignatures', () => {
            beforeEach(() => {
                rules = getRulesByName('removeNonIndexSignatures');
            });

            it('should remove the dash between the words but not the number', () => {
                expect(rules.format('123 - السنن - السنن 5')).toBe('123 - السنن   السنن 5');
            });

            it('should remove the dash', () => {
                expect(rules.format('السنن - السنن')).toBe('السنن   السنن');
                expect(rules.format('123- السنن -السنن 5')).toBe('123- السنن  السنن 5');
                expect(rules.format('Some-Text With- Dashes-')).toBe('Some Text With  Dashes ');
                expect(rules.format('العمل - في المكتب 3 أيام')).toBe('العمل   في المكتب أيام');
            });

            it('should be a no-op', () => {
                expect(rules.format('No Dashes Here')).toBe('No Dashes Here');
                expect(rules.format('123 - الرقم')).toBe('123 - الرقم');
                expect(rules.format('الكتاب 1001 ليلة')).toBe('الكتاب 1001 ليلة');
            });

            it('should not touch the index', () => {
                expect(rules.format('123 -')).toBe('123 -');
                expect(rules.format('123 -')).toBe('123 -');
            });

            it('should remove number in the middle', () => {
                expect(rules.format('اكتب 4 الرقم')).toBe('اكتب الرقم');
                expect(rules.format('سنه 695 6 واكثر')).toBe('سنه   واكثر');
                expect(rules.format('صوتي في اذنه 8 1 الذهبي')).toBe('صوتي في اذنه   الذهبي');
                expect(rules.format('محمد بن وريده البغدادي الحنبلي شيخ المستنصريه 599 697 2 وقد هممت بالرحله')).toBe(
                    'محمد بن وريده البغدادي الحنبلي شيخ المستنصريه   وقد هممت بالرحله',
                );
            });

            it('should remove the leading dash', () => {
                expect(rules.format('-Leading Dash')).toBe(' Leading Dash');
            });
        });

        describe('removeSolitaryArabicLetters', () => {
            beforeEach(() => {
                rules = getRulesByName('removeSolitaryArabicLetters');
            });

            it('should not remove the lone ha since we want to keep it for hijri years', () => {
                expect(rules.format('ا ئاسئله ئ شباب ب الشحر ص صفر ر ه ')).toBe(' ئاسئله شباب الشحر صفر ه ');
            });

            it.skip('should remove all the lone letters', () => {
                expect(rules.format('ا ب ت ث ج ح خ د')).toBe(' ب ث ح د');
            });

            it('should remove the lone letters', () => {
                expect(rules.format('واحد اثنان ثلاثة')).toBe('واحد اثنان ثلاثة');
                expect(rules.format('ا هـــــ')).toBe(' هـــــ');
                expect(rules.format('ب ا الكلمات ت')).toBe(' ا الكلمات ');
            });

            it('should be a no-op', () => {
                expect(rules.format('لا شيء هنا')).toBe('لا شيء هنا');
            });
        });

        describe('cleanSymbolsAndPartReferences', () => {
            beforeEach(() => {
                rules = getRulesByName('cleanSymbolsAndPartReferences');
            });

            it.skip('should remove the references but keep possible indexes', () => {
                expect(rules.format('This is a text (1) (2/3)')).toBe('This is a text  1     ');
            });

            it('should remove the references but keep possible indexes', () => {
                expect(rules.format('Another example [1] [1/2]')).toBe('Another example  ');
            });

            it('should remove the part references', () => {
                expect(rules.format('Part references 1/2 2/3/4')).toBe('Part references    ');
            });

            it('should remove various symbols', () => {
                expect(rules.format('Hello، world! {test} <example> …')).toBe('Hello  world   test   example   ');
            });

            it.skip('should remove text with mixed elements', () => {
                expect(rules.format('Mixed (1) [2] «3» 1/2 [1/2] ;.,!')).toBe('Mixed  1       , ');
            });

            it('should handle text with backslashes and forward slashes', () => {
                expect(rules.format('File path is C:\\folder\\file / Unix path is /usr/bin/')).toBe(
                    'File path is C  folder file   Unix path is  usr bin ',
                );
            });

            it('should remove Arabic symbols and characters', () => {
                expect(rules.format('Arabic example: ﴿س﴾ ۝')).toBe('Arabic example   س   ');
            });
        });

        describe('removeAllDigits', () => {
            beforeEach(() => {
                rules = getRulesByName('removeAllDigits');
            });

            it('should remove all the numbers', () => {
                expect(rules.format('abcd245')).toBe('abcd');
            });
        });

        describe('removeDeathYear', () => {
            beforeEach(() => {
                rules = getRulesByName('removeDeathYear');
            });

            it('should remove all variations', () => {
                expect(rules.format('Sufyān ibn ‘Uyaynah (d. 198h) said:')).toEqual('Sufyān ibn ‘Uyaynah said:');
                expect(rules.format('Sufyān ibn ‘Uyaynah [d. 200H] said:')).toEqual('Sufyān ibn ‘Uyaynah said:');
            });

            it('should not remove died keyword', () => {
                expect(rules.format('Sufyān ibn ‘Uyaynah (died 198H) said:')).toEqual(
                    'Sufyān ibn ‘Uyaynah (died 198H) said:',
                );
                expect(rules.format('Sufyān ibn ‘Uyaynah [died 15H] said:')).toEqual(
                    'Sufyān ibn ‘Uyaynah [died 15H] said:',
                );
            });
        });

        describe('removeNonIndexSignatures', () => {
            beforeEach(() => {
                rules = getRulesByName('removeNonIndexSignatures');
            });

            it('should not remove numbers that are more than 1 digit', () => {
                expect(rules.format('وهب  وقال   لوحه 121 الجرح')).toEqual('وهب  وقال   لوحه 121 الجرح');
            });

            it('should remove 1 digit numbers in between Arabic texts', () => {
                expect(rules.format('الورقه 3 المصدر')).toEqual('الورقه المصدر');
            });

            it('should not remove indexes', () => {
                expect(rules.format('123 - الرقم')).toEqual('123 - الرقم');
            });

            it('should remove consecutive numbers', () => {
                expect(rules.format('سنه 695 6 واكثر')).toEqual('سنه   واكثر');
            });

            it('should remove three consecutive numbers', () => {
                expect(rules.format('معجم الشيوخ الورقه 35 69 2 الذهبي معجم الشيوخ')).toEqual(
                    'معجم الشيوخ الورقه   الذهبي معجم الشيوخ',
                );
            });

            it('should not remove numbers', () => {
                expect(rules.format('معجم الشيوخ الورقه 32 الذهبي معجم الشيوخ')).toEqual(
                    'معجم الشيوخ الورقه 32 الذهبي معجم الشيوخ',
                );
            });

            it('should remove the series of numbers at end of the string', () => {
                expect(rules.format('الورقه 175 171')).toEqual('الورقه  ');
            });
        });

        describe('insertSpaceBetweenArabicTextAndNumber', () => {
            beforeEach(() => {
                rules = getRulesByName('insertSpaceBetweenArabicTextAndNumber');
            });

            it('should insert a space between Arabic text and number', () => {
                expect(rules.format('الآية37')).toBe('الآية 37');
            });

            it('should insert a space between Arabic text and number in a sentence', () => {
                expect(rules.format('قال29 وأجاب43')).toBe('قال 29 وأجاب 43');
            });

            it('should not insert space between Arabic text and non-number characters', () => {
                expect(rules.format('الآية: ثلاثون وسبعة')).toBe('الآية: ثلاثون وسبعة');
            });

            it('should handle a string with no Arabic text and number', () => {
                expect(rules.format('Hello World123')).toBe('Hello World123');
            });
        });

        describe('fixTrailingWow', () => {
            beforeEach(() => {
                rules = getRulesByName('fixTrailingWow');
            });

            it('should fix trailing wow', () => {
                expect(rules.format('السلام عليكم و رحمة الله وبركاته الطرخون او ورق و')).toBe(
                    'السلام عليكم ورحمة الله وبركاته الطرخون او ورق و',
                );
            });

            it('should fix another trailing wow', () => {
                expect(rules.format('الأشاعرة لكنهما ما قصدوا مخالفة الكتاب و السنة و إنما وهموا و ظنوا')).toBe(
                    'الأشاعرة لكنهما ما قصدوا مخالفة الكتاب والسنة وإنما وهموا وظنوا',
                );
            });
        });

        describe('addSpaceAfterColon', () => {
            beforeEach(() => {
                rules = getRulesByName('addSpaceAfterColon');
            });

            it('should add a space after colon', () => {
                expect(rules.format('a:ksjdf')).toBe('a: ksjdf');
                expect(rules.format('2:asdf')).toBe('2: asdf');
                expect(rules.format('a:2 of them')).toBe('a: 2 of them');
                expect(rules.format('(al-Nūr:27)')).toBe('(al-Nūr: 27)');
            });

            it('should not add space for ayah', () => {
                expect(rules.format('61:23')).toBe('61:23');
                expect(rules.format('1:2')).toBe('1:2');
            });

            it('should add space for Arabic ayah signature', () => {
                expect(rules.format('قال : ومشايخنا')).toBe('قال: ومشايخنا');
                expect(rules.format('[النور: 36]')).toBe('[النور: 36]');
            });
        });
    });
});

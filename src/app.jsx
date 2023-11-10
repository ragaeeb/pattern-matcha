import { h } from "preact";
import { useState } from "preact/hooks";
import { getArabicSanitizingRules } from "pattern-matcha";
import "./app.css"; // This line should be at the top of your file
import packageInfo from "../package.json";

export function App() {
  const [text, setText] = useState(
    `حَدَّثَنَا عَبْدُ اللَّهِ بْنُ مَسْلَمَةَ، قَالَ قَرَأْتُ عَلَى مَالِكٍ عَنِ ابْنِ شِهَابٍ، أَنَّ عُمَرَ بْنَ عَبْدِ الْعَزِيزِ، أَخَّرَ الصَّلاَةَ يَوْمًا، فَدَخَلَ عَلَيْهِ عُرْوَةُ بْنُ الزُّبَيْرِ، فَأَخْبَرَهُ أَنَّ الْمُغِيرَةَ بْنَ شُعْبَةَ أَخَّرَ الصَّلاَةَ يَوْمًا وَهْوَ بِالْعِرَاقِ، فَدَخَلَ عَلَيْهِ أَبُو مَسْعُودٍ الأَنْصَارِيُّ فَقَالَ مَا هَذَا يَا مُغِيرَةُ أَلَيْسَ قَدْ عَلِمْتَ أَنَّ جِبْرِيلَ نَزَلَ فَصَلَّى، فَصَلَّى رَسُولُ اللَّهِ صلى الله عليه وسلم ثُمَّ صَلَّى فَصَلَّى رَسُولُ اللَّهِ صلى الله عليه وسلم ثُمَّ صَلَّى فَصَلَّى رَسُولُ اللَّهِ صلى الله عليه وسلم ثُمَّ صَلَّى فَصَلَّى رَسُولُ اللَّهِ صلى الله عليه وسلم ثُمَّ صَلَّى فَصَلَّى رَسُولُ اللَّهِ صلى الله عليه وسلم ثُمَّ قَالَ ‏ "‏ بِهَذَا أُمِرْتُ ‏"‏‏.‏ فَقَالَ عُمَرُ لِعُرْوَةَ اعْلَمْ مَا تُحَدِّثُ أَوَإِنَّ جِبْرِيلَ هُوَ أَقَامَ لِرَسُولِ اللَّهِ صلى الله عليه وسلم وَقْتَ الصَّلاَةِ‏.‏ قَالَ عُرْوَةُ كَذَلِكَ كَانَ بَشِيرُ بْنُ أَبِي مَسْعُودٍ يُحَدِّثُ عَنْ أَبِيهِ‏.‏ قَالَ عُرْوَةُ وَلَقَدْ حَدَّثَتْنِي عَائِشَةُ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم كَانَ يُصَلِّي الْعَصْرَ، وَالشَّمْسُ فِي حُجْرَتِهَا قَبْلَ أَنْ تَظْهَرَ‏.‏
    `
  );

  const handleRulesChange = (event) => {
    setRules(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleProcessText = () => {
    try {
      const formatted = getArabicSanitizingRules().format(text);
      setText(formatted);
    } catch (error) {
      alert("Error parsing rules or processing text: " + error.message);
    }
  };

  return (
    <div>
      <h1>Pattern Matcha v{packageInfo.dependencies["pattern-matcha"]} Demo</h1>
      <div>
        <textarea
          value={text}
          style={{ minWidth: "100%" }}
          onChange={handleTextChange}
          placeholder="Enter text to format"
        />
        <button onClick={handleProcessText}>Process Text</button>
      </div>
    </div>
  );
}

import { h } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { getFilteredRules, Rules } from "pattern-matcha";
import "./app.css";
import packageInfo from "../package.json";
import examples from "./examples.json";

export function App() {
  const textRef = useRef();
  const [rule, setRule] = useState();

  useEffect(() => {
    document.title = packageInfo.name;
  }, []);

  useEffect(() => {
    if (rule) {
      textRef.current.value = rule.example;
    }
  }, [rule]);

  const idToRule = useMemo(() => {
    return getFilteredRules(Boolean).rules.reduce((acc, r) => {
      return { ...acc, [r.id]: r };
    }, {});
  }, []);

  return (
    <div>
      <h1>
        {packageInfo.name} by {packageInfo.author} v
        {packageInfo.dependencies["pattern-matcha"]} Demo
      </h1>
      <div>
        <textarea
          ref={textRef}
          onFocus={(e) => {
            if (rule) {
              e.target.value = new Rules([idToRule[rule.id]]).format(
                e.target.value
              );
            }
          }}
          style={{ minWidth: "100%" }}
          placeholder="Enter text to format"
        />
        Total rules: {Object.keys(idToRule).length}
        <ul>
          {examples.map((r) => {
            return (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setRule(r);
                  }}
                >
                  [{r.id}] {r.id === rule?.id ? r.name.toUpperCase() : r.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

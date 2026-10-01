import { useState } from "react";
import { BUTTON_TYPE } from "../../../shared/constants/content.ts";
import { I18N_NEXT, I18N_PREV, I18N_RESTART, I18N_STEP } from "../../../shared/constants/content.ts";
import { usePreferences } from "../../preferences/components/usePreferences.ts";

export function AnimationPlayer({ steps }: { steps: string[] }) {
  const { t } = usePreferences();
  const [index, setIndex] = useState(0);
  const last = steps.length - 1;

  return (
    <div>
      <p>
        {t(I18N_STEP)} {index + 1} / {steps.length}
      </p>
      <div className="actions">
        <button type={BUTTON_TYPE} disabled={index === 0} onClick={() => setIndex(index - 1)}>
          {t(I18N_PREV)}
        </button>
        <button type={BUTTON_TYPE} disabled={index === last} onClick={() => setIndex(index + 1)}>
          {t(I18N_NEXT)}
        </button>
        <button type={BUTTON_TYPE} onClick={() => setIndex(0)}>
          {t(I18N_RESTART)}
        </button>
      </div>
      <div className="steps">
        {steps.map((step, stepIndex) => (
          <div key={step} className={stepIndex === index ? "step is-current" : "step"}>
            {stepIndex + 1}. {step}
          </div>
        ))}
      </div>
    </div>
  );
}

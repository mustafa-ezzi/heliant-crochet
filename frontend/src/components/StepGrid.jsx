import { ArrowDoodle, BoxDoodle, NotebookDoodle } from "./Doodles";
import { steps } from "../data/steps";

const MARKS = [ArrowDoodle, BoxDoodle, NotebookDoodle];

export default function StepGrid() {
  return (
    <div className="steps-grid">
      {steps.map((step, index) => {
        const Mark = MARKS[index];
        return (
          <article className="step-card" key={step.title}>
            <Mark className="step-mark" />
            <span className="step-num">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        );
      })}
    </div>
  );
}

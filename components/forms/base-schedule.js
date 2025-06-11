import { useState } from "react";

import { useTranslation } from "../../hooks/use-translation";

export default function BaseSchedule({
  required,
  className,
  label,
  min,
  max,
  value,
  touched,
  error,
}) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    days: 0,
    from: value[0] || min,
    to: value[1] || max,
  });

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  function handleDays(e) {
    const {
      target: { value },
    } = e;
    setState({
      ...state,
      days: state.days ^ value,
    });
    // 1, 2, 4, 8, 16, 32, 64
  }

  console.log(state);
  return (
    <>
      <div className={className}>
        {label && (
          <label>
            {label}
            {required ? <span className="text-danger">*</span> : ""}:
          </label>
        )}
        <div className="btn-group d-flex" role="group">
          {days.map((v, i) => {
            const bit = Math.pow(2, i);
            return (
              <button
                key={i}
                type="button"
                value={bit}
                className={`btn ${
                  (state.days & bit) != 0
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                } overflow-hidden`}
                onClick={handleDays}
                title={t(v)}
              >
                {t(v).slice(0, 1)}
              </button>
            );
          })}
        </div>
        <div className="d-flex">
          <input
            className="form-control w-25"
            type="number"
            value={state.from}
          />
          <input
            className="form-range w-25 border-top border-bottom"
            type="range"
            min={min}
            max={max / 2}
            value={state.from}
            onChange={(e) => setState({ ...state, from: e.target.value })}
          />
          <input
            className="form-range w-25 border-top border-bottom"
            type="range"
            min={max / 2}
            max={max}
            value={state.to}
            onChange={(e) => setState({ ...state, to: e.target.value })}
          />
          <input className="form-control w-25" type="number" value={state.to} />
        </div>
        <input type="hidden" value={JSON.stringify(state)} />
        {touched && error && typeof error == "string" ? (
          <span className="text-danger small">{error}</span>
        ) : null}
      </div>
    </>
  );
}

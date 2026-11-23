import styles from "./MealIcon.module.css";

/**
 * Animated, generic food illustrations for menu rows. They show the *kind*
 * of meal (bowl, curry, roti…), never a photo claiming to be the dish.
 */
export type MealKind =
  | "bowl"
  | "curry"
  | "roti"
  | "salad"
  | "grill"
  | "cup"
  | "glass"
  | "plate";

const RULES: [RegExp, MealKind][] = [
  [/salad/i, "salad"],
  [/smoothie|juice|shake|lassi|milk/i, "glass"],
  [/chapat|chappat|roti|parotta|porotta|paratha|dosa|appam|naan|idli|puttu/i, "roti"],
  [/grill|tikka|kebab|kabab|fry|fried|bbq|tandoor/i, "grill"],
  [/curry|masala|gravy|dal|sambar|stew|kuruma|korma/i, "curry"],
  [/rice|biryani|pulao/i, "bowl"],
  [/protein|chicken|egg|fish|meat|beef|mutton/i, "grill"],
  [/bowl|meal/i, "bowl"],
  [/tea|coffee|chai/i, "cup"],
];

export function pickMealKind(items: string, mealTitle: string): MealKind {
  for (const [pattern, kind] of RULES) {
    if (pattern.test(items)) return kind;
  }
  return mealTitle.trim().toLowerCase() === "breakfast" ? "cup" : "plate";
}

const ink = styles.iInk;
const lime = `${styles.iInk} ${styles.iLime}`;
const deep = `${styles.iInk} ${styles.iDeep}`;
const paper = `${styles.iInk} ${styles.iPaper}`;
const tint = `${styles.iInk} ${styles.iTint}`;

function Steam({ xs, y = 40 }: { xs: number[]; y?: number }) {
  return (
    <>
      {xs.map((x, i) => (
        <path
          key={x}
          d={`M${x} ${y} c-5 -6 5 -10 0 -18`}
          className={`${ink} ${styles.iSteam}`}
          style={{ animationDelay: `${i * 0.45}s` }}
        />
      ))}
    </>
  );
}

function BowlShape() {
  return (
    <>
      <path
        d="M18 62 H102 C102 88 84 102 60 102 C36 102 18 88 18 62 Z"
        className={lime}
      />
      <path d="M44 106 H76" className={ink} />
    </>
  );
}

function Art({ kind }: { kind: MealKind }) {
  switch (kind) {
    case "bowl":
      return (
        <>
          <Steam xs={[46, 60, 74]} y={34} />
          <path d="M28 62 Q60 26 92 62 Z" className={paper} />
          <circle cx="50" cy="52" r="3.5" className={styles.iInkFill} />
          <circle cx="66" cy="46" r="3.5" className={styles.iInkFill} />
          <circle cx="74" cy="56" r="3.5" className={styles.iInkFill} />
          <BowlShape />
        </>
      );
    case "curry":
      return (
        <>
          <Steam xs={[44, 60, 76]} y={40} />
          <path d="M22 62 H8 M98 62 H112" className={ink} />
          <path
            d="M22 56 H98 V70 C98 88 84 100 60 100 C36 100 22 88 22 70 Z"
            className={lime}
          />
          <ellipse cx="60" cy="56" rx="38" ry="9" className={deep} />
          {[46, 62, 76].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={56}
              r="3.5"
              className={`${paper} ${styles.iPulse}`}
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </>
      );
    case "roti":
      return (
        <>
          <Steam xs={[48, 62, 76]} y={42} />
          <ellipse cx="60" cy="90" rx="42" ry="12" className={tint} />
          <ellipse cx="60" cy="78" rx="42" ry="12" className={paper} />
          <g className={styles.iWobble}>
            <ellipse cx="60" cy="66" rx="42" ry="12" className={lime} />
            <circle cx="44" cy="64" r="3" className={styles.iInkFill} />
            <circle cx="62" cy="69" r="3" className={styles.iInkFill} />
            <circle cx="78" cy="63" r="3" className={styles.iInkFill} />
          </g>
        </>
      );
    case "salad":
      return (
        <>
          <g className={styles.iBob}>
            <ellipse
              cx="42"
              cy="52"
              rx="16"
              ry="10"
              transform="rotate(-32 42 52)"
              className={deep}
            />
            <ellipse
              cx="62"
              cy="44"
              rx="16"
              ry="10"
              transform="rotate(8 62 44)"
              className={tint}
            />
          </g>
          <g className={styles.iBob} style={{ animationDelay: "0.5s" }}>
            <ellipse
              cx="82"
              cy="52"
              rx="15"
              ry="9"
              transform="rotate(34 82 52)"
              className={deep}
            />
            <circle cx="58" cy="56" r="8" className={`${ink} ${styles.iRed}`} />
          </g>
          <BowlShape />
        </>
      );
    case "grill":
      return (
        <>
          {[
            "M88 18 l6 -10",
            "M100 30 l10 -5",
            "M104 46 h11",
          ].map((d, i) => (
            <path
              key={d}
              d={d}
              className={`${ink} ${styles.iBlink}`}
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
          <g className={styles.iWobble}>
            <path d="M50 72 L30 92" className={styles.iBone} />
            <path d="M50 72 L30 92" className={styles.iBoneCore} />
            <circle cx="26" cy="88" r="6.5" className={paper} />
            <circle cx="34" cy="96" r="6.5" className={paper} />
            <ellipse
              cx="68"
              cy="52"
              rx="28"
              ry="23"
              transform="rotate(-40 68 52)"
              className={lime}
            />
            <path d="M58 42 q8 -8 18 -6" className={ink} />
          </g>
        </>
      );
    case "cup":
      return (
        <>
          <Steam xs={[44, 56, 68]} y={42} />
          <path d="M82 58 C102 58 102 84 82 84" className={ink} />
          <path
            d="M30 50 H82 V78 C82 92 72 100 56 100 C40 100 30 92 30 78 Z"
            className={lime}
          />
          <path d="M20 106 H94" className={ink} />
        </>
      );
    case "glass":
      return (
        <>
          <path d="M40 36 H80 L74 102 H46 Z" className={paper} />
          <path d="M42 58 H78 L74 102 H46 Z" className={lime} />
          <path d="M68 16 L58 74" className={ink} />
          {[52, 62, 68].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={90}
              r="3"
              className={`${paper} ${styles.iRise}`}
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </>
      );
    default:
      return (
        <>
          <circle cx="60" cy="62" r="34" className={paper} />
          <circle cx="60" cy="62" r="21" className={lime} />
          <g className={styles.iBob}>
            <path
              d="M14 34 V92 M7 34 V50 Q7 57 14 57 Q21 57 21 50 V34"
              className={ink}
            />
          </g>
          <g className={styles.iBob} style={{ animationDelay: "0.6s" }}>
            <ellipse cx="106" cy="45" rx="7" ry="11" className={tint} />
            <path d="M106 56 V92" className={ink} />
          </g>
        </>
      );
  }
}

const LABEL: Record<MealKind, string> = {
  bowl: "Bowl",
  curry: "Curry",
  roti: "Flatbread",
  salad: "Salad",
  grill: "Protein dish",
  cup: "Hot drink",
  glass: "Drink",
  plate: "Meal",
};

export default function MealIcon({
  kind,
  animated = false,
}: {
  kind: MealKind;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={styles.mealIcon}
      data-animated={animated}
      role="img"
      aria-label={`${LABEL[kind]} illustration`}
    >
      <Art kind={kind} />
    </svg>
  );
}

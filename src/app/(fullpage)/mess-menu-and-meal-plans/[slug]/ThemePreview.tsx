import Link from "next/link";
import {
  DEFAULT_THEME,
  PREVIEW_SLUG,
  THEME_IDS,
  THEME_META,
  type ThemeId,
} from "./themes/registry";
import styles from "./ThemePreview.module.css";

const BASE = "/mess-menu-and-meal-plans";
const PREVIEW_PATH = `/mess-menu-and-meal-plans/${PREVIEW_SLUG}`;

/* ─── Wireframe toolkit ────────────────────────────────────────────────────── */

type Tone =
  | "white"
  | "soft"
  | "tint"
  | "forest"
  | "lime"
  | "paper"
  | "ink"
  | "cream"
  | "band"
  | "butter"
  | "peach"
  | "warm";

function Sec({
  tone,
  curved,
  children,
}: {
  tone: Tone;
  curved?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.sec} ${curved ? styles.curved : ""}`} data-tone={tone}>
      {children}
    </div>
  );
}

function Ln({ w = 100, bold = false, h }: { w?: number; bold?: boolean; h?: number }) {
  return (
    <span
      className={`${styles.ln} ${bold ? styles.lnBold : ""}`}
      style={{ ["--w" as string]: `${w}%`, ...(h ? { height: h } : {}) }}
    />
  );
}

function Ph({ h = 60, rot = 0 }: { h?: number; rot?: number }) {
  return <span className={styles.ph} style={{ height: h, rotate: `${rot}deg` }} />;
}

function Bt({ ghost = false }: { ghost?: boolean }) {
  return <span className={`${styles.bt} ${ghost ? styles.btGhost : ""}`} />;
}

function Card({ children, rot = 0 }: { children: React.ReactNode; rot?: number }) {
  return (
    <div className={styles.card} style={{ rotate: `${rot}deg` }}>
      {children}
    </div>
  );
}

/* ─── The two mock structures ──────────────────────────────────────────────── */

function StandardWire() {
  return (
    <>
      <Sec tone="white">
        <div className={`${styles.row} ${styles.between}`}>
          <Ln w={22} bold />
          <div className={styles.row}>
            <Ln w={9} />
            <Ln w={9} />
            <Ln w={9} />
          </div>
          <Bt />
        </div>
      </Sec>
      <Sec tone="tint">
        <div className={styles.split}>
          <div className={styles.col}>
            <Ln w={30} />
            <Ln w={85} bold h={9} />
            <Ln w={60} bold h={9} />
            <Ln w={90} />
            <div className={styles.row}>
              <Bt />
              <Bt ghost />
            </div>
          </div>
          <Ph h={74} />
        </div>
        <div className={styles.grid4}>
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <Ln w={60} bold />
              <Ln w={80} />
            </Card>
          ))}
        </div>
      </Sec>
      <Sec tone="white">
        <div className={styles.split}>
          <div className={styles.col}>
            <Ln w={40} bold h={9} />
            <Ln w={95} />
            <Ln w={90} />
            <Ln w={70} />
          </div>
          <Ph h={64} />
        </div>
      </Sec>
      <Ph h={42} />
      <Sec tone="soft">
        <div className={styles.col}>
          <Ln w={46} bold h={9} />
          <div className={styles.row}>
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className={`${styles.tab} ${i === 2 ? styles.tabOn : ""}`} />
            ))}
          </div>
          <div className={styles.split}>
            <Card>
              <Ln w={40} bold />
              <Ln w={90} />
              <Ln w={80} />
            </Card>
            <Card>
              <Ln w={70} />
              <Ln w={60} />
              <Ln w={75} />
            </Card>
          </div>
        </div>
      </Sec>
      <Sec tone="white">
        <div className={styles.grid3}>
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <Ph h={26} />
              <Ln w={60} bold />
              <Ln w={85} />
            </Card>
          ))}
        </div>
      </Sec>
      <Sec tone="white">
        <div className={styles.split}>
          <Card>
            <Ln w={50} bold />
            <Ln w={40} bold h={12} />
            <Bt />
          </Card>
          <Ph h={64} />
        </div>
      </Sec>
      <Sec tone="soft">
        <div className={styles.col}>
          <Ln w={70} />
          <Ln w={60} />
          <Ln w={66} />
        </div>
      </Sec>
      <Sec tone="ink">
        <Ln w={40} />
      </Sec>
    </>
  );
}

function ModernWire() {
  return (
    <>
      <Sec tone="lime">
        <div className={`${styles.row} ${styles.between}`}>
          <Ln w={24} bold />
          <Bt />
        </div>
        <div className={styles.col} style={{ marginTop: 8 }}>
          <Ln w={92} bold h={14} />
          <Ln w={70} bold h={14} />
        </div>
        <div className={styles.split} style={{ marginTop: 8 }}>
          <Ph h={66} rot={-5} />
          <div className={styles.col}>
            <span className={styles.sticker} />
            <Ln w={70} />
            <Ln w={50} />
            <Bt />
          </div>
        </div>
      </Sec>
      <Sec tone="forest" curved>
        <div className={styles.split}>
          <div className={styles.col}>
            <Ln w={30} />
            <Ln w={95} />
            <Ln w={90} />
            <Ln w={60} />
          </div>
          <span className={styles.note} />
        </div>
      </Sec>
      <div className={styles.slant}>
        <Ln w={100} bold h={9} />
      </div>
      <Ph h={42} />
      <Sec tone="paper" curved>
        <div className={styles.col}>
          <Ln w={64} bold h={12} />
          <div className={styles.row}>
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className={`${styles.disc} ${i === 2 ? styles.discOn : ""}`} />
            ))}
          </div>
          <div className={styles.split}>
            <Card rot={-2}>
              <Ln w={50} bold h={9} />
              <Ln w={90} />
              <Ln w={75} />
            </Card>
            <Card rot={2}>
              <Ln w={70} />
              <Ln w={60} />
            </Card>
          </div>
        </div>
      </Sec>
      <Sec tone="tint">
        <div className={styles.grid3}>
          {[-3, 2, -2].map((r, i) => (
            <Card key={i} rot={r}>
              <Ln w={50} bold />
              <Ln w={85} />
            </Card>
          ))}
        </div>
      </Sec>
      <Sec tone="lime" curved>
        <div className={styles.split}>
          <Card rot={-2}>
            <Ln w={50} bold />
            <Ln w={44} bold h={14} />
            <Bt />
          </Card>
          <Ph h={62} rot={4} />
        </div>
      </Sec>
      <Sec tone="forest" curved>
        <div className={styles.col}>
          <Ln w={60} bold h={9} />
          <Ln w={80} />
          <Ln w={70} />
        </div>
      </Sec>
      <Sec tone="ink">
        <Ln w={90} bold h={14} />
      </Sec>
    </>
  );
}

function ClassicWire() {
  return (
    <>
      <Sec tone="cream">
        <div className={`${styles.row} ${styles.between}`}>
          <Ln w={22} bold />
          <div className={styles.row}>
            <Ln w={9} />
            <Ln w={9} />
            <Ln w={9} />
          </div>
          <span className={styles.outlineBt} />
        </div>
      </Sec>
      <Sec tone="cream">
        <div className={`${styles.col} ${styles.center}`}>
          <span className={styles.ring} />
          <Ln w={64} bold h={9} />
          <Ln w={44} bold h={9} />
          <Ln w={58} />
          <div className={styles.row}>
            <span className={styles.solidBt} />
            <span className={styles.outlineBt} />
          </div>
          <span className={styles.frame}>
            <Ph h={56} />
          </span>
          <span className={styles.ruledRow}>
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </Sec>
      <Sec tone="cream">
        <div className={styles.split}>
          <div className={styles.col}>
            <Ln w={40} bold h={8} />
            <Ln w={96} />
            <Ln w={90} />
            <Ln w={70} />
          </div>
          <span className={styles.frame}>
            <Ph h={52} />
          </span>
        </div>
      </Sec>
      <Sec tone="band">
        <div className={`${styles.col} ${styles.center}`}>
          <Ln w={46} bold h={8} />
          <span className={styles.menuFrame}>
            <span className={styles.row}>
              {Array.from({ length: 7 }).map((_, i) => (
                <i key={i} className={`${styles.tabDash} ${i === 2 ? styles.tabDashOn : ""}`} />
              ))}
            </span>
            <span className={styles.leaderRow}>
              <Ln w={18} bold />
              <i />
              <Ln w={34} />
            </span>
            <span className={styles.leaderRow}>
              <Ln w={18} bold />
              <i />
              <Ln w={30} />
            </span>
          </span>
        </div>
      </Sec>
      <Sec tone="cream">
        <span className={styles.ruledRow}>
          <i />
          <i />
          <i />
        </span>
      </Sec>
      <Sec tone="band">
        <div className={`${styles.col} ${styles.center}`}>
          <span className={styles.menuFrame}>
            <Ln w={50} bold h={8} />
            <Ln w={38} bold h={14} />
            <span className={styles.solidBt} />
          </span>
        </div>
      </Sec>
      <Sec tone="cream">
        <div className={styles.col}>
          <Ln w={70} />
          <Ln w={60} />
          <Ln w={66} />
        </div>
      </Sec>
      <Sec tone="forest">
        <Ln w={40} />
      </Sec>
    </>
  );
}

function WarmWire() {
  return (
    <>
      <Sec tone="warm">
        <span className={styles.pillNav}>
          <Ln w={24} bold />
          <span className={styles.pillBt} />
        </span>
        <div className={styles.split} style={{ marginTop: 10 }}>
          <div className={styles.col}>
            <span className={styles.dashPill} />
            <Ln w={86} bold h={10} />
            <Ln w={58} bold h={10} />
            <Ln w={92} />
            <div className={styles.row}>
              <span className={styles.pillBt} />
              <span className={styles.pillBtSoft} />
            </div>
          </div>
          <span className={styles.blob} />
        </div>
        <div className={styles.grid4} style={{ marginTop: 10 }}>
          {["tint", "butter", "peach", "white"].map((c) => (
            <span key={c} className={styles.chipCard} data-c={c}>
              <Ln w={60} bold />
            </span>
          ))}
        </div>
      </Sec>
      <Sec tone="tint" curved>
        <div className={styles.split}>
          <span className={styles.blob} />
          <div className={styles.col}>
            <Ln w={40} bold h={9} />
            <Ln w={95} />
            <Ln w={85} />
            <Ln w={70} />
          </div>
        </div>
      </Sec>
      <Sec tone="butter" curved>
        <div className={`${styles.col} ${styles.center}`}>
          <Ln w={40} bold h={9} />
          <div className={styles.row}>
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className={`${styles.dayPill} ${i === 2 ? styles.dayPillOn : ""}`} />
            ))}
          </div>
          <span className={styles.chalk}>
            <Ln w={34} bold h={8} />
            <span className={styles.chalkRow}>
              <i />
              <Ln w={50} />
            </span>
            <span className={styles.chalkRow}>
              <i />
              <Ln w={44} />
            </span>
          </span>
        </div>
      </Sec>
      <Sec tone="warm" curved>
        <div className={styles.grid3}>
          {["tint", "butter", "peach"].map((c) => (
            <span key={c} className={styles.softCard} data-c={c}>
              <Ph h={22} />
              <Ln w={60} bold />
              <Ln w={82} />
            </span>
          ))}
        </div>
      </Sec>
      <Sec tone="tint" curved>
        <div className={styles.split}>
          <span className={styles.softCard} data-c="white">
            <Ln w={50} bold />
            <Ln w={42} bold h={12} />
            <span className={styles.pillBt} />
          </span>
          <span className={styles.blob} />
        </div>
      </Sec>
      <Sec tone="forest" curved>
        <div className={`${styles.col} ${styles.center}`}>
          <Ln w={30} />
          <Ln w={50} bold h={9} />
        </div>
      </Sec>
    </>
  );
}

function Wireframe({ id }: { id: ThemeId }) {
  return (
    <div className={styles.wf} aria-hidden>
      <div className={styles.wfInner}>
        {id === "modern" ? (
          <ModernWire />
        ) : id === "classic" ? (
          <ClassicWire />
        ) : id === "warm" ? (
          <WarmWire />
        ) : (
          <StandardWire />
        )}
      </div>
    </div>
  );
}

/* ─── Chooser page ─────────────────────────────────────────────────────────── */

export function ThemeChooser({ mess }: { mess?: string }) {
  // Only ever interpolated into a path, so accept slug-shaped values only.
  const messSlug = mess && /^[a-z0-9][a-z0-9-]{0,120}$/i.test(mess) ? mess : null;
  return (
    <main className={styles.chooser}>
      <div className={styles.chooserInner}>
        <p className={styles.eyebrow}>Landing page themes</p>
        <h1 className={styles.title}>Pick a look for the landing page</h1>
        <p className={styles.lead}>
          Each theme shows the same mess details in a different style. The
          outline below is the page structure; open a preview to see it with
          sample data, then select the one you want.
        </p>

        <div className={styles.grid}>
          {THEME_IDS.map((id) => {
            const meta = THEME_META[id];
            const isDefault = id === DEFAULT_THEME;
            return (
              <article
                key={id}
                className={`${styles.themeCard} ${isDefault ? styles.themeCardOn : ""}`}
              >
                <Wireframe id={id} />
                <div className={styles.themeBody}>
                  <div className={styles.nameRow}>
                    <h2 className={styles.themeName}>{meta.name}</h2>
                    {isDefault && (
                      <span className={styles.selectedBadge}>Default</span>
                    )}
                  </div>
                  <p className={styles.themeTag}>{meta.tagline}</p>
                  <p className={styles.themeDesc}>{meta.description}</p>
                  <ul className={styles.traits}>
                    {meta.traits.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className={styles.actions}>
                    {messSlug && (
                      <Link
                        href={`${BASE}/${messSlug}/custom-theme/${id}`}
                        className={styles.cta}
                      >
                        {`Use ${meta.name} for ${messSlug}`}
                      </Link>
                    )}
                    <Link
                      href={`${PREVIEW_PATH}/custom-theme/${id}`}
                      className={styles.ctaGhost}
                    >
                      Preview with sample data
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className={styles.fineprint}>
          {messSlug ? (
            <>
              Every page opens in the {THEME_META[DEFAULT_THEME].name} theme by
              default. To use another theme for {messSlug}, share its link:{" "}
              <code>{`${BASE}/${messSlug}/custom-theme/<theme>`}</code>
            </>
          ) : (
            <>
              Every mess page opens in the {THEME_META[DEFAULT_THEME].name} theme
              by default. Add <code>/custom-theme/&lt;theme&gt;</code> to a
              mess page address to see it in another theme.
            </>
          )}
        </p>
      </div>
    </main>
  );
}

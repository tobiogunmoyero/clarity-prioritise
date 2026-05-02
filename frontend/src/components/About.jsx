export const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-14 animate-fade-in">
      <div className="rule-top pt-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          About
        </div>
        <h1 className="mt-2 font-editorial text-5xl tracking-tight leading-tight">
          Clarity Prioritise
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          A small tool for ranking ideas with three classical product
          frameworks. It is deliberately quiet — no accounts, no cloud, no
          tracking.
        </p>
      </div>

      <section className="mt-10 space-y-6 text-[15px] leading-relaxed">
        <h2 className="font-editorial text-2xl tracking-tight">
          The privacy model
        </h2>
        <p>
          Everything you type lives only in your browser, inside{" "}
          <code className="font-mono-system text-sm bg-secondary px-1.5 py-0.5 rounded">
            localStorage
          </code>
          . The page never sends your boards to a server, because there is no
          server. Close the tab and your data stays exactly where you left it —
          on this device, in this browser profile.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li data-testid="about-bullet-no-accounts">
            No sign-up, no accounts, no passwords.
          </li>
          <li data-testid="about-bullet-no-analytics">
            No analytics, no telemetry, no third-party scripts.
          </li>
          <li data-testid="about-bullet-no-fonts">
            No external fonts loaded over the network. System fonts only.
          </li>
          <li data-testid="about-bullet-offline">
            Fully usable offline after the first load.
          </li>
          <li data-testid="about-bullet-export">
            You own your data — export any board to a JSON file at any time.
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-[15px] leading-relaxed">
        <h2 className="font-editorial text-2xl tracking-tight">
          The three frameworks
        </h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-editorial text-xl">RICE</h3>
            <p className="mt-1 text-muted-foreground">
              Score <em>Reach × Impact × Confidence</em>, divided by{" "}
              <em>Effort</em>. Works well when you can put rough numbers on
              everything.
            </p>
          </div>
          <div>
            <h3 className="font-editorial text-xl">Kano</h3>
            <p className="mt-1 text-muted-foreground">
              Sort ideas by the type of satisfaction they produce:{" "}
              <em>Must-have, Performance, Delighter, Indifferent, Reverse</em>.
              Best when you're talking about user delight, not just output.
            </p>
          </div>
          <div>
            <h3 className="font-editorial text-xl">Value vs Effort</h3>
            <p className="mt-1 text-muted-foreground">
              The classic 2×2. Fast to fill in when RICE feels like overkill.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-3 text-[15px] leading-relaxed">
        <h2 className="font-editorial text-2xl tracking-tight">
          Clearing your data
        </h2>
        <p>
          To wipe everything: open your browser's devtools, go to Application →
          Local Storage, and delete the key{" "}
          <code className="font-mono-system text-sm bg-secondary px-1.5 py-0.5 rounded">
            clarity-prioritise:v1
          </code>
          . That is the only key this app uses for board data.
        </p>
      </section>

      <footer className="mt-16 pt-6 border-t border-border text-xs text-muted-foreground">
        Made to be boring, on purpose.
      </footer>
    </div>
  );
};

export default About;

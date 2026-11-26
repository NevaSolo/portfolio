import { CONTACT } from "@/data/contact";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10 md:px-34">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg">
            FANEVA SOLOMAMPIONONA
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-fg-mute">
            Full Stack Developer × AI Developer
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-fg-dim">
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg" data-cursor="hover">
            LinkedIn
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hover:text-fg" data-cursor="hover">
            Email
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs text-fg-mute">
        © 2026 Faneva Solomampionona. All rights reserved.
      </p>
      <p className="mx-auto mt-2 max-w-7xl text-xs text-fg-mute">
        Modèle 3D «&nbsp;
        <a
          href="https://sketchfab.com/3d-models/laptop-676e365f61f544e9a0236b7519e1bc90"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fg-dim"
        >
          Laptop
        </a>
        &nbsp;» par{" "}
        <a
          href="https://sketchfab.com/GeniusPilot2016"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fg-dim"
        >
          GeniusPilot2016
        </a>
        , sous licence{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fg-dim"
        >
          CC BY 4.0
        </a>
        .
      </p>
      <p className="mx-auto mt-1 max-w-7xl text-xs text-fg-mute">
        Modèle 3D «&nbsp;
        <a
          href="https://sketchfab.com/3d-models/pixar-lampe-da09cec0fbc043f7a08c0d0165a643ee"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fg-dim"
        >
          Pixar Lampe
        </a>
        &nbsp;» par{" "}
        <a
          href="https://sketchfab.com/TiSzma"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fg-dim"
        >
          TiSzma
        </a>
        , sous licence{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fg-dim"
        >
          CC BY 4.0
        </a>
        , simplifié pour le web.
      </p>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-ucla-100 bg-white text-slate-600">
      <div className="h-[2px] gold-divider" aria-hidden />
      <div className="container-page py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={30} />
              <div>
                <div className="font-serif text-base font-semibold leading-tight text-ucla-900">
                  Sports Medicine X-Ray Academy
                </div>
                <div className="text-[12px] leading-tight text-ucla-700">
                  Jeremy Swisher, MD &nbsp;·&nbsp; UCLA Sports Medicine
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-slate-600">
              For clinician education only. Does not replace formal radiology
              interpretation, clinical judgment, or institutional protocols.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-6 sm:gap-10 text-sm">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ucla-700">
                Curriculum
              </div>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <Link to="/modules" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Modules
                  </Link>
                </li>
                <li>
                  <Link to="/cases" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Case library
                  </Link>
                </li>
                <li>
                  <Link to="/videos" className="text-slate-600 hover:text-ucla-900 no-underline">
                    AMSSM videos
                  </Link>
                </li>
                <li>
                  <Link to="/flashcards" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Flashcards
                  </Link>
                </li>
                <li>
                  <Link to="/cheatsheets" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Cheat sheets
                  </Link>
                </li>
                <li>
                  <Link to="/atlas" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Image atlas
                  </Link>
                </li>
                <li>
                  <Link to="/progress" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Progress
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ucla-700">
                Assessment
              </div>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <Link to="/quiz/pre" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Pre-course quiz
                  </Link>
                </li>
                <li>
                  <Link to="/quiz/post" className="text-slate-600 hover:text-ucla-900 no-underline">
                    Post-course quiz
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-slate-200 pt-5 text-[12px] text-slate-500 sm:flex-row sm:items-center">
          <div>© {year} Jeremy Swisher, MD · Original UCLA Sports Medicine curriculum.</div>
          <div>AMSSM YouTube videos linked as supplemental external resources.</div>
        </div>
      </div>
    </footer>
  );
}

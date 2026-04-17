import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ApiPage({ onSignIn, onSignUp, currentUser, onLogout }) {
  const endpointExamples = [
    {
      method: "POST",
      path: "/v1/remove-background",
      description: "Upload an image and get transparent PNG output.",
    },
    {
      method: "POST",
      path: "/v1/batch/remove-background",
      description: "Process multiple images in one API request.",
    },
    {
      method: "GET",
      path: "/v1/usage",
      description: "Track credits, requests, and monthly usage stats.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06050F] font-plus text-[#F0EEFF]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_10%,rgba(79,70,229,.18)_0%,transparent_70%),radial-gradient(ellipse_60%_50%_at_85%_20%,rgba(124,58,237,.14)_0%,transparent_65%),radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(37,99,235,.12)_0%,transparent_65%),radial-gradient(ellipse_50%_40%_at_90%_90%,rgba(168,85,247,.10)_0%,transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.04)_1px,transparent_0)] bg-[length:12px_12px] opacity-20" />

      <Navbar
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <section className="relative z-10 mx-auto w-full max-w-[1280px] px-10 py-16">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-600/15 px-3.5 py-1.5 text-xs text-violet-300">
            Developer API
          </span>
          <h1 className="font-syne text-[clamp(30px,4vw,48px)] font-extrabold text-[#F0EEFF]">
            Integrate PixelCut AI
            <span className="bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              In Minutes
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-sm text-[#8B85A8] md:text-base">
            Fast image background removal API with secure auth, predictable
            pricing, and developer-friendly responses.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[24px] border border-violet-500/20 bg-[rgba(18,15,40,.72)] p-7 backdrop-blur-xl">
            <h2 className="font-syne text-2xl font-bold text-[#F0EEFF]">
              Quick Start
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-[#CFCBE7]">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-400" />
                Generate API key from dashboard.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-400" />
                Send `multipart/form-data` image payload.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-400" />
                Receive transparent PNG URL instantly.
              </li>
            </ul>

            <button
              type="button"
              onClick={onSignUp}
              className="mt-6 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(124,58,237,.55)]"
            >
              Get API Key
            </button>
          </div>

          <div className="rounded-[24px] border border-violet-500/20 bg-[rgba(18,15,40,.72)] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-syne text-xl font-bold text-[#F0EEFF]">
                Endpoints
              </h2>
              <span className="rounded-full border border-violet-500/30 px-3 py-1 text-xs text-violet-300">
                v1
              </span>
            </div>

            <div className="space-y-3">
              {endpointExamples.map((item) => (
                <div
                  key={item.path}
                  className="rounded-xl border border-violet-500/20 bg-[#0f0c22]/80 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-violet-600/20 px-2 py-0.5 text-xs font-semibold text-violet-200">
                      {item.method}
                    </span>
                    <span className="text-sm font-medium text-[#F0EEFF]">
                      {item.path}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#9C97B7]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

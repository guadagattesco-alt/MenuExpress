export function Footer() {
  return (
    <footer className="app-footer">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 pb-8 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.5px" }}>
              Menu<span style={{ color: "#3dba72" }}>Express</span>
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Tu planificador gastronómico inteligente. Organizá tus comidas, gestioná
              tu heladera y descubrí qué cocinar hoy.
            </p>
            <div className="flex gap-3 mt-1">
              {["🗓", "🧊", "🚨"].map((icon, i) => (
                <span key={i}
                  className="flex size-9 items-center justify-center rounded-xl text-base"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest"
              style={{ fontFamily: "var(--font-sans)", letterSpacing: "1.5px" }}>
              Funciones
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                ["🗓 Planificador semanal", "Menús para 1, 3 o 7 días"],
                ["🧊 Mi Heladera",          "Stock en tiempo real"],
                ["🚨 Salvavidas",           "Recetas con lo que tenés"],
                ["🛒 Lista de compras",     "Exportá a WhatsApp"],
              ].map(([title, desc]) => (
                <li key={title} className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {title}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest"
              style={{ fontFamily: "var(--font-sans)", letterSpacing: "1.5px" }}>
              Cómo funciona
            </h3>
            <ol className="flex flex-col gap-3">
              {[
                ["01", "Cargá tu heladera", "Agregá lo que tenés en casa"],
                ["02", "Elegí tu objetivo", "Saludable, económico o proteico"],
                ["03", "Generá tu plan",    "Recetas + lista de compras automática"],
                ["04", "Cocinás y restás",  "El stock se actualiza solo"],
              ].map(([num, title, desc]) => (
                <li key={num} className="flex items-start gap-3">
                  <span className="shrink-0 flex size-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "rgba(61,186,114,0.2)", color: "#3dba72", border: "1px solid rgba(61,186,114,0.3)" }}>
                    {num}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {title}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {desc}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            © 2025 MenuExpress · Proyecto académico de Desarrollo Web
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(61,186,114,0.15)", color: "#7eeab0", border: "1px solid rgba(61,186,114,0.25)" }}>
              🌿 App instalable (PWA)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(61,186,114,0.15)", color: "#7eeab0", border: "1px solid rgba(61,186,114,0.25)" }}>
              📱 Responsive
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

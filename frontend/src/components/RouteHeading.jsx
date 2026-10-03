export default function RouteHeading({ kicker, title, children }) {
  return (
    <main className="route-page">
      <div className="wrap">
        {kicker ? <p className="eyebrow">{kicker}</p> : null}
        <h1>{title}</h1>
        {children}
      </div>
    </main>
  );
}

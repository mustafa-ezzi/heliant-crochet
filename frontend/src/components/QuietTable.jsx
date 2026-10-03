import Flower from "./Flower";

export default function QuietTable() {
  return (
    <div className="empty-card shop-empty">
      <Flower className="doodle" />
      <h2>The table is quiet for a moment. Please try again.</h2>
    </div>
  );
}

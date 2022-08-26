import { Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>DND React Page Builder MVP</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/new">New</Link> |{" "}
        <Link to="/edit">Edit</Link> |{" "}
        <Link to="/preview">Preview</Link>
      </nav>
    </div>
  );
}
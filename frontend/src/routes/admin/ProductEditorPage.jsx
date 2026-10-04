import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Flower from "../../components/Flower";
import { adminRequest, uploadPhoto } from "../../lib/admin";

const CATEGORIES = ["Wear", "Home", "Baby", "Custom"];

const EMPTY = {
  name: "",
  price: "",
  category: "Wear",
  fiber: "",
  hidden: false,
  description: "",
  images: [],
  colors: [{ name: "Lilac", hex: "#c9a6e0" }],
  sizes: [{ name: "One size", stock: "" }],
};

export default function ProductEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(!id);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminRequest(`/api/v1/admin/products/${id}`).then((product) => {
      setFields({
        name: product.name,
        price: String(product.price_cents / 100),
        category: product.category,
        fiber: product.fiber,
        hidden: product.hidden,
        description: product.description,
        images: product.images?.length ? product.images : product.image ? [product.image] : [],
        colors: product.colors.length ? product.colors : EMPTY.colors,
        sizes: product.sizes.length
          ? product.sizes.map((size) => ({ name: size.name, stock: size.stock ?? "" }))
          : EMPTY.sizes,
      });
      setReady(true);
    });
  }, [id]);

  function set(name, value) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function onPhoto(event) {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    if (!files.length) return;
    const room = 8 - fields.images.length;
    if (room < 1) {
      setErrors((current) => ({ ...current, image: "Eight photos is the most for one piece." }));
      return;
    }
    setUploading(true);
    setErrors((current) => ({ ...current, image: undefined }));
    const added = [];
    try {
      for (const file of files.slice(0, room)) {
        added.push(await uploadPhoto(file));
      }
      setFields((current) => ({ ...current, images: [...current.images, ...added] }));
      if (files.length > room) {
        setErrors((current) => ({ ...current, image: "Eight photos is the most for one piece." }));
      }
    } catch (error) {
      if (added.length) {
        setFields((current) => ({ ...current, images: [...current.images, ...added] }));
      }
      setErrors((current) => ({ ...current, image: error.message }));
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index) {
    setFields((current) => ({
      ...current,
      images: current.images.filter((_, photoIndex) => photoIndex !== index),
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const price = Number(fields.price);
    const next = {};
    if (!fields.name.trim()) next.name = "Name the piece.";
    if (!Number.isFinite(price) || price <= 0) next.price = "Add a price.";
    if (!fields.description.trim()) next.description = "Tell a little about the piece.";
    if (uploading) {
      setErrors({ image: "Wait for the photo to finish." });
      return;
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = {
      name: fields.name.trim(),
      price_cents: Math.round(price * 100),
      category: fields.category,
      fiber: fields.fiber.trim(),
      hidden: fields.hidden,
      description: fields.description.trim(),
      images: fields.images,
      colors: fields.colors.filter((color) => color.name.trim()),
      sizes: fields.sizes
        .filter((size) => size.name.trim())
        .map((size) => ({ name: size.name.trim(), stock: size.stock === "" ? null : Number(size.stock) })),
    };
    try {
      if (id) await adminRequest(`/api/v1/admin/products/${id}`, { method: "PATCH", body });
      else await adminRequest("/api/v1/admin/products", { method: "POST", body });
      navigate("/admin/products");
    } catch (err) {
      setErrors(err.payload || { detail: err.message });
    }
  }

  if (!ready) return <p className="lede">One moment.</p>;

  return (
    <form className="editor" onSubmit={onSubmit}>
      <div className="editor-fields">
        <Field label="Name" error={errors.name}>
          <input value={fields.name} onChange={(event) => set("name", event.target.value)} />
        </Field>
        <Field label="Price (PKR)" error={errors.price}>
          <input value={fields.price} onChange={(event) => set("price", event.target.value)} inputMode="decimal" />
        </Field>
        <Field label="Category" error={errors.category}>
          <select value={fields.category} onChange={(event) => set("category", event.target.value)}>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </Field>
        <Field label="Yarn" error={errors.fiber}>
          <input value={fields.fiber} onChange={(event) => set("fiber", event.target.value)} />
        </Field>
        <Field label="Status">
          <select value={fields.hidden ? "hidden" : "on_table"} onChange={(event) => set("hidden", event.target.value === "hidden")}>
            <option value="on_table">On the table</option>
            <option value="hidden">Hidden</option>
          </select>
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea rows={5} value={fields.description} onChange={(event) => set("description", event.target.value)} />
        </Field>
        <fieldset className="variant-set">
          <legend>Colors</legend>
          {fields.colors.map((color, index) => (
            <div className="variant-row" key={`color-${index}`}>
              <input
                value={color.name}
                aria-label="Color name"
                onChange={(event) => updateRow("colors", index, { name: event.target.value })}
              />
              <input
                type="color"
                value={color.hex || "#c9a6e0"}
                aria-label="Color"
                onChange={(event) => updateRow("colors", index, { hex: event.target.value })}
              />
            </div>
          ))}
          <button type="button" className="text-button" onClick={() => set("colors", [...fields.colors, { name: "", hex: "#d7b6ea" }])}>
            Add a color
          </button>
        </fieldset>
        <fieldset className="variant-set">
          <legend>Sizes</legend>
          {fields.sizes.map((size, index) => (
            <div className="variant-row" key={`size-${index}`}>
              <input
                value={size.name}
                aria-label="Size"
                onChange={(event) => updateRow("sizes", index, { name: event.target.value })}
              />
              <input
                value={size.stock}
                aria-label="Stock, or blank for made to order"
                placeholder="Made to order"
                onChange={(event) => updateRow("sizes", index, { stock: event.target.value })}
              />
            </div>
          ))}
          <button type="button" className="text-button" onClick={() => set("sizes", [...fields.sizes, { name: "", stock: "" }])}>
            Add a size
          </button>
        </fieldset>
        {errors.detail ? <p className="error">{errors.detail}</p> : null}
        {errors.sizes ? <p className="error">{errors.sizes}</p> : null}
        <button className="btn" type="submit">
          Save the piece
        </button>
      </div>
      <div className="photo-board">
        {fields.images.length ? (
          <div className="editor-photos">
            {fields.images.map((src, index) => (
              <figure className="editor-photo" key={`${src}-${index}`}>
                <img src={src} alt="" />
                <figcaption>{index === 0 ? "Cover" : index + 1}</figcaption>
                <button type="button" onClick={() => removePhoto(index)} aria-label={`Remove photo ${index + 1}`}>
                  Remove
                </button>
              </figure>
            ))}
          </div>
        ) : null}
        <label className={fields.images.length ? "dropzone is-compact" : "dropzone"}>
          {fields.images.length ? null : <Flower />}
          <span>
            {uploading
              ? "Sending the photos…"
              : fields.images.length
                ? "Add another photo"
                : "Drop photos of the piece"}
          </span>
          {errors.image ? <p className="error">{errors.image}</p> : null}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={onPhoto}
            disabled={uploading || fields.images.length >= 8}
          />
        </label>
      </div>
    </form>
  );

  function updateRow(key, index, patch) {
    set(
      key,
      fields[key].map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    );
  }
}

function Field({ label, error, children }) {
  return (
    <div className={error ? "field is-error" : "field"}>
      <label>{label}</label>
      {children}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

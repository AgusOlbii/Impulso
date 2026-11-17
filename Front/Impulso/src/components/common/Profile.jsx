import { useEffect, useState } from "react";
import Icon from "./Icon";
import Header from "./Header";
import { deleteAccount, updateProfile, uploadPhoto } from "../../services/authServices";
import { mediaUrl } from "../../utils/media";
import { coachService } from "../../services/coach.service";
import { reviewService } from "../../services/review.service";
import RatingStars from "./RatingStars";

function Profile({ user, setUser, onLogout, profesorElegidoId }) {
  const esAlumno = user.rol === "student" || user.rol === "alumno";
  const [approved, setApproved] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [ratingNotice, setRatingNotice] = useState("");
  const profesor = esAlumno
    ? approved.find((item) => Number(item.id) === Number(profesorElegidoId))
    : null;
  const puedeCalificar = Boolean(profesor);

  useEffect(() => {
    if (!esAlumno) return;
    coachService
      .list()
      .then((data) => setApproved(data.coaches || []))
      .catch(() => setApproved([]));
  }, [esAlumno]);

  useEffect(() => {
    if (!puedeCalificar) {
      setMyRating(0);
      return;
    }
    reviewService
      .mine(profesor.id)
      .then((data) => setMyRating(Number(data.review?.rating) || 0))
      .catch(() => setMyRating(0));
  }, [puedeCalificar, profesor?.id]);
  const [isEditing, setIsEditing] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [formData, setFormData] = useState({
    phone: user.phone || "",
    birthday: user.birthday ? user.birthday.split("T")[0] : "",
    weight: user.weight || "",
    height: user.height || "",
    goal: user.goal || "",
    medical_notes: user.medical_notes || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    try {
      const data = await updateProfile(user, formData);
      if (data.user) setUser(data.user);
      else setUser((prevUser) => ({ ...prevUser, ...formData }));
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message || "No se pudo guardar el perfil.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin cargar";
    const cleanDate = dateString.split("T")[0];
    const [year, month, day] = cleanDate.split("-");

    return `${day}/${month}/${year}`;
  };

  const initials = `${(user.name?.[0] || "U").toUpperCase()}${(user.lastname?.[0] || "").toUpperCase()}`;
  const photoSrc = mediaUrl(user.image_url);

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount();
      setConfirmDelete(false);
      onLogout();
    } catch (error) {
      setDeleteError(error.message || "No se pudo eliminar la cuenta.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    try {
      const data = await uploadPhoto(file);
      if (data.user) setUser(data.user);
      else setUser((actual) => ({ ...actual, image_url: data.image_url }));
    } catch (err) {
      setPhotoError(err.message || "No se pudo subir la foto.");
    }
  };

  return (
    <>
      <Header eyebrow="TU CUENTA" title="Mi perfil" />
      <div className="profile-hero">
        <div className="avatar avatar-large profile-photo">
          {photoSrc ? (
            <img src={photoSrc} alt={`${user.name} ${user.lastname || ""}`} />
          ) : (
            initials
          )}
          <label className="profile-photo-upload">
            Subir foto
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>
        </div>
        <div>
          <h2>{user.name}</h2>
          <p>Socio desde {user.creado_en}</p>
          <span className="status-pill">
            <i /> Cuenta activa
          </span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="outline-button"
        >
          {isEditing ? "Cancelar" : "Editar perfil"}
        </button>
      </div>
      {(photoError || saveError) && <p className="apply-error">{saveError || photoError}</p>}
      <div className="profile-layout">
        <section className="profile-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span className="eyebrow">INFORMACIÓN PERSONAL</span>
          </div>

          {!isEditing ? (
            <div className="info-grid">
              <div>
                <span>Nombre completo</span>
                <strong>
                  {user.name} {user.lastname}
                </strong>
              </div>
              <div>
                <span>DNI</span>
                <strong>{user.dni}</strong>
              </div>
              <div>
                <span>Correo electrónico</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Teléfono</span>
                <strong>{user.phone || "No especificado"}</strong>
              </div>
              <div>
                <span>Fecha de nacimiento</span>
                <strong>{formatDate(user.birthday)}</strong>
              </div>

              {user.rol === "student" && (
                <>
                  <div>
                    <span>Peso</span>
                    <strong>
                      {user.weight ? `${user.weight} kg` : "Sin registrar"}
                    </strong>
                  </div>
                  <div>
                    <span>Altura</span>
                    <strong>
                      {user.height ? `${user.height} cm` : "Sin registrar"}
                    </strong>
                  </div>
                  <div>
                    <span>Objetivo</span>
                    <strong>{user.goal || "Sin especificar"}</strong>
                  </div>
                  <div>
                    <span>Notas médicas</span>
                    <strong>{user.medical_notes || "Ninguna"}</strong>
                  </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="info-grid">
              <div>
                <span>Nombre completo</span>
                <strong>
                  {user.name} {user.lastname} (No editable)
                </strong>
              </div>
              <div>
                <span>DNI</span>
                <strong>{user.dni} (No editable)</strong>
              </div>
              <div>
                <span>Correo electrónico</span>
                <strong>{user.email} (No editable)</strong>
              </div>
              <div>
                <span>Teléfono</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <span>Fecha de nacimiento</span>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </div>

              {user.rol === "student" && (
                <>
                  <div>
                    <span>Peso (kg)</span>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <span>Altura (cm)</span>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <span>Objetivo</span>
                    <input
                      type="text"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <span>Notas médicas</span>
                    <input
                      type="text"
                      name="medical_notes"
                      value={formData.medical_notes}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                <button type="submit" className="outline-button">
                  Guardar cambios
                </button>
              </div>
            </form>
          )}
        </section>
        {esAlumno && (
          <aside className="plan-panel">
            <div className="plan-icon">
              <Icon name="user" />
            </div>
            <span className="eyebrow">TU PROFESOR</span>
            <h3>{profesor ? profesor.name : "Sin profesor asignado"}</h3>
            <p>
              {profesor
                ? `${profesor.specialty} · ${profesor.price || `$${profesor.precio?.toLocaleString("es-AR")}`} / mes`
                : "Elegí un profesor desde el menú Profesores."}
            </p>
            {profesor && (
              <p>
                Promedio {profesor.rating} · {profesor.reviews || 0} valoraciones
              </p>
            )}
            {puedeCalificar && (
              <div className="plan-rating">
                <span>TU CALIFICACIÓN</span>
                <RatingStars
                  value={myRating}
                  onChange={async (rating) => {
                    const previous = myRating;
                    setMyRating(rating);
                    try {
                      await reviewService.save({ coachId: profesor.id, rating });
                      setRatingNotice("");
                      const data = await coachService.list();
                      setApproved(data.coaches || []);
                    } catch (error) {
                      setMyRating(previous);
                      setRatingNotice(error.message || "No se pudo guardar la calificación.");
                    }
                  }}
                />
                {ratingNotice && <small>{ratingNotice}</small>}
              </div>
            )}
          </aside>
        )}
      </div>
      <div className="settings-list">
        {user.rol !== "admin" && (
          <button className="danger" type="button" onClick={() => { setDeleteError(""); setConfirmDelete(true); }}>
            <span className="setting-icon">
              <Icon name="trash" />
            </span>
            <span>
              <strong>Eliminar cuenta</strong>
              <small>Borrar tu cuenta de Impulso</small>
            </span>
            <Icon name="arrow" />
          </button>
        )}
        <button className="danger" onClick={onLogout}>
          <span className="setting-icon">
            <Icon name="logout" />
          </span>
          <span>
            <strong>Cerrar sesión</strong>
            <small>Salir de tu cuenta de Impulso</small>
          </span>
          <Icon name="arrow" />
        </button>
      </div>
      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => !deleting && setConfirmDelete(false)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-account"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">ELIMINAR CUENTA</span>
            <h3 id="confirm-delete-account">¿Eliminar tu cuenta?</h3>
            <p>Se van a borrar tus datos de Impulso. Esta acción no se puede deshacer.</p>
            {deleteError && <p className="apply-error">{deleteError}</p>}
            <div className="confirm-actions">
              <button type="button" className="text-button" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancelar
              </button>
              <button type="button" className="primary-button" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? "Eliminando..." : "Eliminar cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
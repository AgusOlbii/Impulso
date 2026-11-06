import { useEffect, useState } from "react";
import Icon from "./Icon";
import Header from "./Header";
import { updateProfile, getCurrentUser, uploadPhoto } from "../../services/authServices";
import { coachService } from "../../services/coach.service";
import { reviewService } from "../../services/review.service";
import { mediaUrl } from "../../utils/media";
import RatingStars from "./RatingStars";

function Profile({ user, setUser, onLogout, profesorElegidoId }) {
  const [profesor, setProfesor] = useState(null);

  useEffect(() => {
    if (!profesorElegidoId) {
      setProfesor(null);
      return;
    }
    coachService
      .list()
      .then((data) => {
        setProfesor(
          (data.coaches || []).find((item) => item.id === profesorElegidoId) ||
            null
        );
      })
      .catch(() => setProfesor(null));
  }, [profesorElegidoId]);
  const esAlumno = user.rol === "student" || user.rol === "alumno";
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(() => formFromUser(user));
  const [rating, setRating] = useState(0);
  const [ratingNotice, setRatingNotice] = useState("");

  useEffect(() => {
    if (!esAlumno || !profesorElegidoId) {
      setRating(0);
      return;
    }
    reviewService
      .mine()
      .then((data) => setRating(data.review?.rating || 0))
      .catch(() => setRating(0));
  }, [esAlumno, profesorElegidoId]);

  function formFromUser(data) {
    return {
      phone: data.phone || "",
      birthday: data.birthday ? String(data.birthday).split("T")[0] : "",
      weight: data.weight ?? "",
      height: data.height ?? "",
      goal: data.goal || "",
      medical_notes: data.medical_notes || "",
    };
  }

  const startEdit = () => {
    setFormData(formFromUser(user));
    setError("");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setFormData(formFromUser(user));
    setError("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateProfile(user, formData);
      const session = await getCurrentUser();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser((prevUser) => ({ ...prevUser, ...formData }));
      }
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "No se pudo guardar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin cargar";
    const cleanDate = String(dateString).split("T")[0];
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "Sin cargar";
    return `${day}/${month}/${year}`;
  };

  const socioDesde = user.created_at || user.creado_en;
  const photoSrc = mediaUrl(user.image_url);
  const initials = `${(user.name?.[0] || "U").toUpperCase()}${(user.lastname?.[0] || "").toUpperCase()}`;

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const data = await uploadPhoto(file);
      if (data.user) setUser(data.user);
      else setUser((actual) => ({ ...actual, image_url: data.image_url }));
    } catch (err) {
      setError(err.message || "No se pudo subir la foto.");
    }
  };

  const saveRating = async (score) => {
    setRating(score);
    try {
      await reviewService.save({ rating: score });
      setRatingNotice("Gracias. Tu valoración ya cuenta para tu profesor.");
    } catch (err) {
      setRatingNotice(err.message || "No se pudo guardar la valoración.");
    }
  };

  return (
    <>
      <Header eyebrow="TU CUENTA" title="Mi perfil" />
      <div className="profile-hero">
        <div className="avatar avatar-large profile-photo">
          {photoSrc ? <img src={photoSrc} alt={`${user.name} ${user.lastname || ""}`} /> : initials}
          <label className="profile-photo-upload">
            Subir foto
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>
        </div>
        <div>
          <h2>
            {user.name} {user.lastname}
          </h2>
          <p>Socio desde {socioDesde ? formatDate(socioDesde) : "—"}</p>
          <span className="status-pill">
            <i /> Cuenta activa
          </span>
        </div>
        <button
          type="button"
          onClick={isEditing ? cancelEdit : startEdit}
          className="outline-button"
        >
          {isEditing ? "Cancelar" : "Editar perfil"}
        </button>
      </div>
      <div className="profile-layout">
        <section className="profile-section">
          <span className="eyebrow">INFORMACIÓN PERSONAL</span>

          {error && <p className="apply-error">{error}</p>}

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
                <strong>{user.dni || "Sin cargar"}</strong>
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
              {esAlumno && (
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
            <form onSubmit={handleSubmit} className="info-grid profile-edit-grid">
              <div>
                <span>Nombre completo</span>
                <strong>
                  {user.name} {user.lastname}
                </strong>
              </div>
              <div>
                <span>DNI</span>
                <strong>{user.dni || "Sin cargar"}</strong>
              </div>
              <div>
                <span>Correo electrónico</span>
                <strong>{user.email}</strong>
              </div>
              <label>
                <span>Teléfono</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="3511234567"
                />
              </label>
              <label>
                <span>Fecha de nacimiento</span>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </label>
              {esAlumno && (
                <>
                  <label>
                    <span>Peso (kg)</span>
                    <input
                      type="number"
                      name="weight"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="72"
                    />
                  </label>
                  <label>
                    <span>Altura (cm)</span>
                    <input
                      type="number"
                      name="height"
                      min="0"
                      step="0.1"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="176"
                    />
                  </label>
                  <label>
                    <span>Objetivo</span>
                    <input
                      type="text"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      placeholder="Hipertrofia, fuerza, etc."
                    />
                  </label>
                  <label>
                    <span>Notas médicas</span>
                    <input
                      type="text"
                      name="medical_notes"
                      value={formData.medical_notes}
                      onChange={handleChange}
                      placeholder="Lesiones, alergias, etc."
                    />
                  </label>
                </>
              )}
              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="text-button"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </section>
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
          {esAlumno && profesor && (
            <div className="plan-rate">
              <span>¿Cómo te viene la rutina?</span>
              <RatingStars value={rating} onChange={saveRating} />
              {ratingNotice && <small>{ratingNotice}</small>}
            </div>
          )}
        </aside>
      </div>
      <div className="settings-list">
        <button>
          <span className="setting-icon">
            <Icon name="bell" />
          </span>
          <span>
            <strong>Notificaciones</strong>
            <small>Recordatorios y mensajes</small>
          </span>
          <Icon name="arrow" />
        </button>
        <button>
          <span className="setting-icon">
            <Icon name="settings" />
          </span>
          <span>
            <strong>Preferencias</strong>
            <small>Privacidad y configuración de la cuenta</small>
          </span>
          <Icon name="arrow" />
        </button>
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
    </>
  );
}

export default Profile;

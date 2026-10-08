import Icon from "./icon";
import Header from "../components/Header";

function Profile() {
  return (
    <>
      <Header eyebrow="CUENTA" title="Mi perfil" />

      <section className="profile-card">
        <div className="profile-header">
          <div className="avatar large">JP</div>

          <div>
            <h2>Juliana Pérez</h2>
            <p>Socio desde marzo 2026</p>
          </div>

          <button className="secondary-button">
            <Icon name="edit" size={17} />
            Editar perfil
          </button>
        </div>

        <div className="profile-details">
          <div>
            <span>EMAIL</span>
            <strong>juliana@email.com</strong>
          </div>

          <div>
            <span>TELÉFONO</span>
            <strong>+54 341 555 0192</strong>
          </div>

          <div>
            <span>MEMBRESÍA</span>
            <strong>Plan Premium</strong>
          </div>

          <div>
            <span>PRÓXIMO PAGO</span>
            <strong>12 septiembre 2026</strong>
          </div>
        </div>
      </section>
    </>
  );
}
export default Profile;

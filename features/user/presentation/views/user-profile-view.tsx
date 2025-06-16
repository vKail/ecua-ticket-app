import UserProfileActions from "../componets/user-profile-actions";
import UserProfileHeader from "../componets/user-profile-header";

export default function UserProfileView() {
  return (
    <div className=" min-h-screen">
      {/* Controlar el ancho desde aquí si quieres */}
      <div className="w-11/12 mx-auto">
        {/* Header del perfil */}
        <UserProfileHeader />

        {/* Acciones del usuario */}
        <UserProfileActions />
      </div>
    </div>
  );
}

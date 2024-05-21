import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Login = () => {
  //REDIRIGIR
  const navigate = useNavigate();
  //CAPTURAR LOS EMAIL Y LA CONTRASEÑA
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  //SWEETALERT
  const MySwal = withReactContent(Swal);
  //CONTROLAR SPINNER
  const [loading, setloading] = useState(false);

  //FUNCION DE LOGIN
  const LoginUser = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      if (email.trim() === "" || pass.trim() === "") {
        MySwal.fire({
          title: "¡Error!",
          text: "No deje ningún campo vacío.",
          icon: "error",
          confirmButtonText: "¡Entendido!",
        });
        return;
      }
      const response = await signInWithEmailAndPassword(auth, email, pass);
      //console.log("RESPUESTA LOGIN", response.user.accessToken);
      MySwal.fire({
        title: "¡Bienvenid@!",
        text: "¡Bienvenid@ de vuelta al Software!",
        icon: "success",
      });
      setloading(false);
      //Guardar Token
      localStorage.setItem("token", response.user.accessToken.slice(0, 100));
      // Redirigir a la página de Listar
      navigate("/Listar");
    } catch (error) {
      setloading(false);
      MySwal.fire({
        title: "¡Error!",
        text:
          error.code === "auth/invalid-credential"
            ? "Email o Contraseña Incorrecta"
            : "Error Interno",
        icon: "error",
        confirmButtonText: "¡Entendido!",
      });
    }

    setEmail("");
    setPass("");
  };

  const LoginGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      MySwal.fire({
        title: "¡Bienvenid@!",
        text: "¡Bienvenid@ de vuelta al Software!",
        icon: "success",
      });
      localStorage.setItem("token", response.user.accessToken.slice(0, 100));
      // Redirigir a la página de Listar
      navigate("/Listar");
    } catch (error) {
      console.log(error);
    }
    setEmail("");
    setPass("");
  };

  return (
    <section className="text-center">
      {loading && ( // Spinner se muestra si loading es true
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
      <div
        className="p-5 bg-image"
        style={{
          backgroundImage: `url('https://mdbootstrap.com/img/new/textures/full/171.jpg')`,
          height: "250px",
        }}
      ></div>

      <div
        className="card mx-4 mx-md-5 d-flex justify-content-center shadow-5-strong bg-body-tertiary"
        style={{
          marginTop: "-100px",
          backdropFilter: "blur(30px)",
        }}
      >
        <div className="card-body py-5 px-md-5">
          <div className="container" style={{ maxWidth: "70%" }}>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-5">INGRESAR AL SISTEMA</h2>
                <form>
                  <div data-mdb-input-init className="form-outline mb-4">
                    <input
                      value={email}
                      type="email"
                      className="form-control"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <label className="form-label" htmlFor="form3Example3">
                      Correo Electronico
                    </label>
                  </div>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <input
                      type="password"
                      className="form-control"
                      value={pass}
                      onChange={(e) => {
                        setPass(e.target.value);
                      }}
                    />
                    <label className="form-label" htmlFor="form3Example4">
                      Contraseña
                    </label>
                  </div>
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    onClick={LoginUser}
                    className="btn btn-primary btn-block mb-4"
                  >
                    Ingresar
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={LoginGoogle}
                    className="btn btn-primary btn-block mb-4"
                  >
                    <FaGoogle />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

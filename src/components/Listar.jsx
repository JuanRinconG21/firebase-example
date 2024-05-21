import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "../firebaseconfig";
import {
  Button,
  Modal,
  Form,
  Card,
  Navbar,
  Container,
  Image,
} from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import { v4, v1 } from "uuid";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Listar = () => {
  const [tokenUser, setToken] = useState("");
  const [localToken, setlocalToken] = useState("");
  const MySwal = withReactContent(Swal);
  const [usuarios, setUsuarios] = useState([]);
  const funcionValidar = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setToken(user.accessToken.slice(0, 100));
        setlocalToken(localStorage.getItem("token"));
      }
    });
  };
  const funcionObtenerDatos = async () => {
    //UN USUARIO
    /* const docRef = doc(db, "personas", "6fffaa49-426c-4d23-920c-698064f398a0");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    } */
    //TODOS LOS USUARIOS
    let Arreglodatos = [];
    const querySnapshot = await getDocs(collection(db, "personas"));
    querySnapshot.forEach((doc) => {
      Arreglodatos.push({ id: doc.id, ...doc.data() });
    });
    setUsuarios(Arreglodatos);
  };
  useEffect(() => {
    funcionValidar();
    funcionObtenerDatos();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [avatar, setAvatar] = useState("");
  const [image, setImage] = useState(null);
  const [color, setColor] = useState("");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleAddInformation = async () => {
    // const urlAvatar = guardarImagen(avatar);
    if (
      nombre.trim() === "" ||
      telefono.trim() === "" ||
      avatar === "" ||
      color === ""
    ) {
      MySwal.fire({
        title: "¡Error!",
        text: "No deje ningún campo vacío.",
        icon: "error",
        confirmButtonText: "¡Entendido!",
      });
    } else {
      const URLimagen = await guardarImagen(avatar);
      console.log(URLimagen);
      let datos = {
        nombre: nombre,
        telefono: telefono,
        image: URLimagen,
        color: color,
      };
      const cityRef = doc(db, "personas", v4());
      const response = await setDoc(cityRef, datos);
    }
    // Aquí puedes limpiar los campos o hacer cualquier otra acción necesaria
    setNombre("");
    setTelefono("");
    setAvatar("");
    setImage(null);
    setColor("");
    const image = document.getElementById("avatar");
    image.value = "";
    // Cerrar la modal después de agregar la información
    handleCloseModal();
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    const imagePreview = URL.createObjectURL(selectedImage);
    setImage(imagePreview);
  };

  const guardarImagen = async (file) => {
    let id = v4();
    const storageRef = ref(storage, id);
    const response = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  return tokenUser === localToken ? (
    <>
      <h1
        style={{ textAlign: "center", color: "white" }}
        className="bg-dark p-3"
      >
        LISTA DE USUARIOS
      </h1>
      <div className="container-fluid">
        <Button variant="dark" className="mt-3" onClick={handleShowModal}>
          Agregar
        </Button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header
            className="bg-dark"
            style={{ color: "white" }}
            closeButton
          >
            <Modal.Title>Agregar Información</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Ingrese su telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAvatar">
                <Form.Label>Avatar</Form.Label>
                <input
                  id="avatar"
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e), setAvatar(e.target.files[0]);
                  }}
                />
                {image !== null ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={image}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        margin: "10px",
                      }}
                    />
                  </div>
                ) : (
                  <span></span>
                )}
              </Form.Group>
              <Form.Group controlId="formAvatar">
                <Form.Label>Color de Fondo</Form.Label>
                <input
                  value={color}
                  type="color"
                  name=""
                  className="form-control"
                  id="color"
                  onChange={(e) => {
                    setColor(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setNombre("");
                setTelefono("");
                setAvatar("");
                setImage(null);
                setColor("");
                const image = document.getElementById("avatar");
                image.value = "";
                handleCloseModal();
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddInformation}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="row">
          {usuarios.length != 0 ? (
            usuarios.map((dataUser) => {
              return (
                <div className="col-4">
                  <div className="mt-4">
                    <Card
                      style={{
                        width: "100%",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        backgroundColor: dataUser.color,
                      }}
                    >
                      <Card.Body>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Image
                            src={dataUser.image}
                            roundedCircle
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <Card.Title
                          style={{
                            textAlign: "center",
                            marginTop: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {dataUser.nombre}
                        </Card.Title>
                        <Card.Text style={{ textAlign: "center" }}>
                          {dataUser.telefono}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  ) : (
    <Navigate to={"/"}></Navigate>
  );
};

export default Listar;

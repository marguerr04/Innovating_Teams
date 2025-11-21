import Swal from "sweetalert2";

export const showErrorAlert = (message) => {
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: message || "Error en el inicio de sesión",
    showConfirmButton: false,
    timer: 2000,
    toast: true,
  });
};

export const showSuccessAlert = (message) => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: message || "Inicio de sesión exitoso",
    showConfirmButton: false,
    timer: 2000,
    toast: true,
  });
};
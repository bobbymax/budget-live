import Swal from "sweetalert2";

class Alert {
  flash = (title, status, mssg) => {
    const warning = Swal.fire({
      icon: status,
      title: title,
      text: mssg,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes! Confirm",
    });

    return warning;
  };

  success = (title, mssg) => {
    Swal.fire({
      icon: "success",
      title: title,
      text: mssg,
      timer: 3000,
    });
  };

  warning = (title, mssg) => {
    Swal.fire({
      icon: "warning",
      title: title,
      text: mssg,
      timer: 3000,
    });
  };

  error = (title, mssg) => {
    Swal.fire({
      icon: "error",
      title: title,
      text: mssg,
      timer: 3000,
    });
  };
}

export default new Alert();

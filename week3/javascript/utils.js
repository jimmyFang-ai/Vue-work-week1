export function swalMassage(title, icon, time) {

    // success 成功, error 錯誤, warning 驚嘆號 , info 說明
    swal.fire({
        toast: true,
        position: 'top-end',
        title: title,
        icon: icon,
        timer: time,
        showConfirmButton: false,
    });
};
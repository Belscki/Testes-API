let token = "";
$(document).ready(function () {
    $('#myForm').submit(function (event) {
        event.preventDefault(); // Previne o envio padrão do formulário
        const username = $('#user').val();
        const password = $('#pass').val();

        $.ajax({
            url: 'https://griffon-fitting-remarkably.ngrok-free.app/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password,
            }),
            success: function (response) {
                token = response.token; // Salva o token recebido
                sessionStorage.setItem('token', token);
                window.location.href = 'html/inicio.html';
            },
            error: function (xhr, status, error) {
                alert('Erro no login: ' + error);
            }
        });
    });
})

const token = sessionStorage.getItem('token');
if (!token) {
    window.location.href = '../index.html'
    console.log('Token não encontrado. O login talvez não tenha sido realizado.');
}

$(document).ready(function () {
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        return;
    }
    $.ajax({
        url: 'http://localhost:3000/protegido/user',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            var user = response.user;
            console.log(response.user)
            $('#header').append(`
                <h1>Olá ${user.username}</h1>
                `)
        },
        error: function (xhr, status, error) {
            alert('Erro ao acessar os dados protegidos: ' + error);
        }
    });


    $('#logout').click(function () {
        sessionStorage.clear();
        window.location.href = '../index.html'
    })
    $('#getDadosFun').click(function () {
        if (!token) {
            alert('Você precisa fazer login primeiro!');
            return;
        }
        $.ajax({
            url: 'http://localhost:3000/protegido/func',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                console.log('Dados protegidos:', response);
                $('#funcionariosTable tbody').empty();
                (response.funcionarios).forEach(function (funcionario) {
                    $('#funcionariosTable tbody').append(
                        `<tr>
                                    <td>${funcionario.nome}</td>
                                    <td>${funcionario.cpf_cnpj}</td>
                                    <td>${funcionario.salario}</td>
                                </tr>`
                    );
                });
            },
            error: function (xhr, status, error) {
                alert('Erro ao acessar os dados protegidos: ' + error);
            }
        });
    })

})

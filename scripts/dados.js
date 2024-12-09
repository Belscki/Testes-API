let token = "";
$(document).ready(function () {
    $('#myForm').submit(function (event) {
        event.preventDefault(); // Previne o envio padrão do formulário
        const username = $('#user').val();
        const password = $('#pass').val();

        $.ajax({
            url: 'http://localhost:3000/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password,
            }),
            success: function (response) {
                token = response.token; // Salva o token recebido
                console.log('Login bem-sucedido! Token: ' + token);
                localStorage.setItem('token', token);
                window.location.href = 'html/inicio.html';
            },
            error: function (xhr, status, error) {
                alert('Erro no login: ' + error);
            }
        });
    });

    // Função para acessar a rota protegida
    $('#getProtectedDataBtn').click(function () {
        if (!token) {
            alert('Você precisa fazer login primeiro!');
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/protegido/user',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token // Adiciona o token no cabeçalho
            },
            success: function (response) {
                console.log('Dados protegidos: ' + JSON.stringify(response));
                alert('Dados protegidos: ' + JSON.stringify(response));
            },
            error: function (xhr, status, error) {
                alert('Erro ao acessar os dados protegidos: ' + error);
            }
        });
    });
    $('#getDadosFun').click(function () {
        if (!token) {
            alert('Você precisa fazer login primeiro!');
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/protegido/func',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token // Adiciona o token no cabeçalho
            },
            success: function (response) {
                console.log('Dados protegidos:', response);
                // Limpa a tabela antes de adicionar novos dados
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
});
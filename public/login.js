const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');

document.getElementById('goToRegister').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('register-section').style.display = 'flex';
});

document.getElementById('goToLogin').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('register-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'flex';
});

document.getElementById('goToLogin2').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('login-section-true').style.display = 'none';
  document.getElementById('login-section').style.display = 'flex';
});

// Seleciona todos os elementos com a classe 'social'
var socialElements = document.getElementsByClassName('social');

// Itera sobre todos os elementos e adiciona o event listener
Array.from(socialElements).forEach(function(element) {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('login-section-true').style.display = 'flex';
  });
});


function togglePasswordVisibility() {
  const passwordFields = document.querySelectorAll('.password-container input[type="password"], .password-container input[type="text"]');
  passwordFields.forEach(field => {
    if (field.type === "password") {
      field.type = "text";
    } else {
      field.type = "password";
    }
  });

  const icons = document.querySelectorAll('.toggle-password i, .toggle-password-true i');
  icons.forEach(icon => {
    if (icon.classList.contains("fa-eye")) {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });

};

document.getElementById('cadastro').addEventListener('click', function() {
  
  const cpfCnpj = document.getElementById('cpf').value;
  const companyName = document.getElementById('empresa').value;
  const password = document.getElementById('password1').value;
  const confirmPassword = document.getElementById('confirm-password').value;


  // Função para exibir o modal
  function exibirModal(mensagem) {
    const modal = document.getElementById('modalMensagem');
    const modalTexto = document.getElementById('modalTexto');
    modalTexto.textContent = mensagem;
    modal.style.display = 'block';
  }

  // Fechar o modal quando clicar no 'x'
  document.getElementById('fecharModal').onclick = function() {
    document.getElementById('modalMensagem').style.display = 'none';
  };

  if (!cpfCnpj || !companyName || !password || !confirmPassword) {
    exibirModal("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (password === confirmPassword) {
    exibirModal(`Empresa "${companyName}" criada com sucesso!\nCPF/CNPJ: ${cpfCnpj}`);
  } else {
    exibirModal("As senhas não coincidem. Por favor, tente novamente.");
  }
});

// Fechar o modal quando clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('modalMensagem');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

function selectType(type) { const cpfButton = document.getElementById('cpf-button'); const cnpjButton = document.getElementById('cnpj-button'); if (type === 'cpf') { cpfButton.classList.add('selected'); cpfButton.disabled = true; cnpjButton.classList.remove('selected'); cnpjButton.disabled = false; } else if (type === 'cnpj') { cnpjButton.classList.add('selected'); cnpjButton.disabled = true; cpfButton.classList.remove('selected'); cpfButton.disabled = false; } } document.getElementById('goToLogin').addEventListener('click', (event) => { event.preventDefault(); document.getElementById('register-section').style.display = 'none'; // Mostrar a seção de login correspondente aqui 
});

  const { ipcRenderer } = require('electron');

  document.getElementById('loginForm').addEventListener('click', (event) => {
    event.preventDefault();

    const username = document.querySelector('.signbtn').value;
    const password = document.getElementById('password').value;

    // Envia os dados de login ao processo principal
    ipcRenderer.send('login-attempt', { username, password });
  });

  // Ouve uma mensagem de falha de login do processo principal
  ipcRenderer.on('login-failed', (event, message) => {
    alert(message); // Exibe uma mensagem de erro
  });

const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?';
const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const botaoGerar = document.querySelector('#gerar-senha');

// Event listeners
botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;
botaoGerar.onclick = geraSenha;

// Monitora mudanças no campo de senha para calcular a força
campoSenha.addEventListener('input', function() {
    classificaSenhaManual(this.value);
});

// Configura os checkboxes
for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].onclick = geraSenha;
}

// Gera senha inicial
geraSenha();

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function geraSenha() {
    let alfabeto = '';
    if (checkbox[0].checked) {
        alfabeto += letrasMaiusculas;
    }
    if (checkbox[1].checked) {
        alfabeto += letrasMinusculas;
    }
    if (checkbox[2].checked) {
        alfabeto += numeros;
    }
    if (checkbox[3].checked) {
        alfabeto += simbolos;
    }
    
    // Verifica se pelo menos um checkbox está marcado
    if (alfabeto === '') {
        campoSenha.value = 'Selecione ao menos uma opção';
        forcaSenha.classList.remove('fraca', 'media', 'forte');
        document.querySelector('.entropia').textContent = '';
        return;
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        const numeroAleatorio = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[numeroAleatorio];
    }
    
    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

function classificaSenha(tamanhoAlfabeto) {
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    atualizaForcaSenha(entropia);
}

function classificaSenhaManual(senha) {
    if (senha === '') {
        forcaSenha.classList.remove('fraca', 'media', 'forte');
        document.querySelector('.entropia').textContent = '';
        return;
    }

    // Analisa a senha manualmente inserida
    let tamanhoAlfabeto = 0;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temSimbolo = /[^A-Za-z0-9]/.test(senha);

    if (temMaiuscula) tamanhoAlfabeto += 26;
    if (temMinuscula) tamanhoAlfabeto += 26;
    if (temNumero) tamanhoAlfabeto += 10;
    if (temSimbolo) tamanhoAlfabeto += simbolos.length;

    const entropia = senha.length * Math.log2(tamanhoAlfabeto || 1);
    atualizaForcaSenha(entropia);
}

function atualizaForcaSenha(entropia) {
    forcaSenha.classList.remove('fraca', 'media', 'forte');
    
    if (entropia > 57) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 35) {
        forcaSenha.classList.add('media');
    } else {
        forcaSenha.classList.add('fraca');
    }

    const valorEntropia = document.querySelector('.entropia');
    if (entropia > 0) {
        const diasParaQuebrar = Math.floor(2 ** entropia / (100e6 * 60 * 60 * 24));
        valorEntropia.textContent = `Um computador pode levar até ${diasParaQuebrar} dias para descobrir essa senha.`;
    } else {
        valorEntropia.textContent = '';
    }
}
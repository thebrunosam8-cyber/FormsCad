/* =====================
   EmailJS Init
   ===================== */
emailjs.init('BsooEKmmq5UeQfise');

/* =====================
   Constants
   ===================== */
const SERVICE_ID  = 'service_v21j55l';
const TEMPLATE_ID = 'template_t0sus7r';
const DEST_EMAIL  = 'thebrunosam8@gmail.com';

const REQUIRED_FIELDS = [
  'nome', 'sobrenome', 'cpf', 'nascimento',
  'email', 'telefone', 'cep', 'logradouro',
  'numero', 'bairro', 'cidade', 'estado'
];

/* =====================
   Masks
   ===================== */
document.getElementById('cpf').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  this.value = v;
});

document.getElementById('telefone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10)     v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  this.value = v;
});

document.getElementById('cep').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  this.value = v;
});

/* =====================
   Validation
   ===================== */
function validate() {
  let valid = true;

  // Required fields
  REQUIRED_FIELDS.forEach(function (id) {
    const el  = document.getElementById(id);
    const wrap = document.getElementById('f-' + id);
    if (!el || !el.value.trim()) {
      wrap && wrap.classList.add('has-error');
      valid = false;
    } else {
      wrap && wrap.classList.remove('has-error');
    }
  });

  // Email format
  const emailVal  = document.getElementById('email').value;
  const emailWrap = document.getElementById('f-email');
  const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  if (emailVal && !emailOk) {
    emailWrap.classList.add('has-error');
    valid = false;
  }

  // CPF length
  const cpfDigits = document.getElementById('cpf').value.replace(/\D/g, '');
  const cpfWrap   = document.getElementById('f-cpf');
  if (cpfDigits && cpfDigits.length !== 11) {
    cpfWrap.classList.add('has-error');
    valid = false;
  } else if (cpfDigits.length === 11) {
    cpfWrap.classList.remove('has-error');
  }

  return valid;
}

/* =====================
   Status Helper
   ===================== */
function showStatus(type, html) {
  const bar = document.getElementById('status-bar');
  bar.className = 'status-bar' + (type ? ' ' + type : '');
  bar.innerHTML = html;
}

/* =====================
   Submit / Send Email
   ===================== */
document.getElementById('btn-salvar').addEventListener('click', function () {
  if (!validate()) {
    showStatus('error', '&#9888; Corrija os campos destacados antes de salvar.');
    return;
  }

  const btn = document.getElementById('btn-salvar');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Enviando...';
  showStatus('', '');

  const params = {
    to_email:        DEST_EMAIL,
    nome:            document.getElementById('nome').value.trim(),
    sobrenome:       document.getElementById('sobrenome').value.trim(),
    cpf:             document.getElementById('cpf').value,
    data_nascimento: document.getElementById('nascimento').value,
    sexo:            document.getElementById('sexo').value || 'Não informado',
    email:           document.getElementById('email').value.trim(),
    telefone:        document.getElementById('telefone').value,
    cep:             document.getElementById('cep').value,
    logradouro:      document.getElementById('logradouro').value.trim(),
    numero:          document.getElementById('numero').value.trim(),
    complemento:     document.getElementById('complemento').value.trim() || 'Não informado',
    bairro:          document.getElementById('bairro').value.trim(),
    cidade:          document.getElementById('cidade').value.trim(),
    estado:          document.getElementById('estado').value,
    perfil:          document.getElementById('perfil').value || 'Não informado',
    status_cadastro: document.getElementById('status_cadastro').value,
    observacoes:     document.getElementById('obs').value.trim() || 'Nenhuma',
    data_envio:      new Date().toLocaleString('pt-BR')
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
    .then(function () {
      btn.disabled = false;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Salvar e enviar cadastro';
      showStatus('success', '&#10003; Cadastro enviado com sucesso para ' + DEST_EMAIL + '!');
    })
    .catch(function (err) {
      btn.disabled = false;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Salvar e enviar cadastro';
      showStatus('error', '&#9888; Erro ao enviar: ' + (err.text || 'verifique suas credenciais no EmailJS.'));
    });
});

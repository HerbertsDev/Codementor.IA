import { challenges } from './data/challenges.js';
import { loadProgress, saveProgress, resetProgress } from './services/storage.js';
import { evaluateDraft } from './services/evaluator.js';
import { icon } from './ui/icons.js';

const app = document.querySelector('#app');
let progress = loadProgress();
let page = 'inicio';
let selected = challenges[0].id;
let feedback = null;
let tutorQuestion = null;
const navigation = [
  ['inicio', 'Início', 'home'], ['desafios', 'Desafios', 'code'],
  ['tutor', 'Tutor virtual', 'sparkles'], ['progresso', 'Meu progresso', 'chart']
];

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function getChallenge() { return challenges.find(item => item.id === selected) || challenges[0]; }
function pct() { return Math.round(progress.completed.length / challenges.length * 100); }
function persist() { saveProgress(progress); }
function goto(view, id) {
  page = view;
  if (id && challenges.some(x => x.id === id)) selected = id;
  feedback = null;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function progressRing() {
  return `<div class="progress-ring" style="--percent:${pct()}%"><div><strong>${pct()}%</strong><span>concluído</span></div></div>`;
}
function challengeCard(c) {
  const done = progress.completed.includes(c.id);
  return `<article class="card challenge-card"><div class="card-top"><span class="pill">${escapeHTML(c.category)}</span><span class="pill ${done ? 'done' : ''}">${done ? '✓ Concluído' : c.level}</span></div><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.summary)}</p><div class="card-foot"><span class="mini">${c.minutes} min · Python</span><button class="btn btn-secondary" data-open="${c.id}">${done ? 'Revisar' : 'Começar'} ${icon('arrow',15)}</button></div></article>`;
}
function heading(label, title, description) { return `<div class="eyebrow">${label}</div><h1 class="title">${title}</h1><p class="lead">${description}</p>`; }
function homeView() {
  const next = challenges.find(c => !progress.completed.includes(c.id)) || challenges[0];
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow">Aprender é construir</div><h1>Seu próximo passo<br>começa com uma linha<br>de código.</h1><p>Aprenda Python no seu ritmo. Resolva desafios, descubra pistas e entenda cada decisão antes de seguir em frente.</p><button class="btn btn-primary btn-hero" data-open="${next.id}">Continuar aprendendo ${icon('arrow',17)}</button></div><div class="card" style="display:flex;flex-direction:column;justify-content:center"><span class="eyebrow">Sua jornada</span>${progressRing()}<p class="mini" style="text-align:center">${progress.completed.length} de ${challenges.length} desafios concluídos</p></div></section><div class="section-header"><div><h2>Escolha seu próximo desafio</h2><p>Comece com o básico e avance aos poucos.</p></div><button class="link-btn" data-page="desafios">Ver todos ${icon('arrow',14)}</button></div><div class="challenge-grid">${challenges.slice(0,2).map(challengeCard).join('')}</div><div class="section-header"><div><h2>Como funciona</h2><p>Um jeito mais ativo de estudar programação.</p></div></div><div class="stat-grid"><div class="card"><div class="eyebrow">01 / Pratique</div><h3 class="small-title" style="margin-top:13px">Escreva seu código</h3><p class="mini">Experimente resolver desafios curtos e próximos da sua rotina.</p></div><div class="card"><div class="eyebrow">02 / Descubra</div><h3 class="small-title" style="margin-top:13px">Peça uma pista</h3><p class="mini">Receba dicas em etapas, sem precisar ver a resposta logo de início.</p></div><div class="card"><div class="eyebrow">03 / Evolua</div><h3 class="small-title" style="margin-top:13px">Acompanhe seu avanço</h3><p class="mini">Confira suas conquistas e retome exercícios quando quiser.</p></div></div>`;
}
function challengesView() {
  return `${heading('Biblioteca de exercícios','Aprenda fazendo.','Quatro desafios para praticar os principais fundamentos de Python. Escolha por onde começar; não precisa seguir uma ordem fixa.')}<div class="challenge-grid">${challenges.map(challengeCard).join('')}</div>`;
}
function workspaceView() {
  const c = getChallenge();
  const count = Math.min(Number(progress.hints[c.id] || 0),c.hints.length);
  const draft = typeof progress.drafts[c.id] === 'string' ? progress.drafts[c.id] : c.starter;
  return `${heading('Laboratório de código',escapeHTML(c.title),escapeHTML(c.summary))}<div class="workbench"><div><div class="card"><div class="card-top"><span class="pill">${escapeHTML(c.category)}</span><span class="mini">${c.minutes} minutos</span></div><h2 class="small-title" style="margin-top:19px">Seu desafio</h2><p class="mini">${escapeHTML(c.task)}</p><div class="editor"><div class="editor-head"><div style="display:flex;align-items:center;gap:12px"><span class="dots"><i></i><i></i><i></i></span> solucao.py</div><span>Python 3 · exemplo</span></div><textarea id="code-input" class="code" aria-label="Editor de código Python" spellcheck="false">${escapeHTML(draft)}</textarea></div><div class="editor-tools"><button class="btn btn-secondary" data-action="restore">Restaurar exemplo</button><button class="btn btn-primary" data-action="verify">${icon('check',16)} Verificar tentativa</button></div>${feedback ? `<div class="result ${feedback.passed ? 'success':'warning'}" role="status">${escapeHTML(feedback.message)}</div>` : ''}<p class="notice">Este é um protótipo. A verificação identifica padrões no texto, não executa o código Python nem garante que ele esteja correto em todos os casos.</p></div></div><aside><div class="card"><div class="eyebrow">Tutor por etapas</div><h2 class="small-title" style="margin-top:13px">Uma dica de cada vez.</h2><p class="mini">Tente resolver sozinho. Se travar, peça uma pista: começamos pelo raciocínio e avançamos aos poucos.</p><div class="tip"><h4>${icon('bulb',17)} ${count ? `Pista ${count} de ${c.hints.length}` : 'Sua próxima pista'}</h4><p>${count ? escapeHTML(c.hints[count-1]) : 'Você pode pedir sua primeira dica quando precisar.'}</p></div><button class="btn btn-secondary" style="width:100%;margin-top:14px" data-action="hint" ${count >= c.hints.length ? 'disabled' : ''}>${count >= c.hints.length ? 'Todas as pistas exibidas' : 'Revelar próxima pista'}</button><div class="divider"></div><h3 class="small-title">O que você vai praticar</h3><div class="steps"><div class="step"><div class="step-index">1</div><div><b>Compreender</b><p>Leia o problema com atenção.</p></div></div><div class="step"><div class="step-index">2</div><div><b>Experimentar</b><p>Escreva e ajuste sua tentativa.</p></div></div><div class="step"><div class="step-index">3</div><div><b>Revisar</b><p>Verifique os requisitos do desafio.</p></div></div></div></div></aside></div>`;
}
function tutorView() {
  const c = getChallenge();
  const answers = {
    conceito: `Neste exercício, o primeiro passo é entender o objetivo: ${c.task} Que parte do enunciado você já sabe resolver?`,
    erro: 'Erros são parte do processo. Confira os nomes das variáveis, a pontuação, os parênteses e a indentação. Depois, compare sua tentativa com os requisitos do exercício.',
    estudo: 'Uma boa estratégia é dividir o problema em partes: entrada, processamento e saída. Escreva cada parte separadamente e só depois una tudo.'
  };
  return `${heading('Apoio ao estudo','Seu tutor, no seu ritmo.','Uma demonstração de como a plataforma pode orientar estudantes com perguntas e dicas, em vez de entregar tudo pronto.')}<div class="workbench"><section class="card"><div class="card-top"><h2 class="small-title">Conversa guiada</h2><span class="pill">Demonstração</span></div><div class="chat-bubble"><strong>CODEMENTOR</strong>Oi! 👋 Qual parte da programação você quer entender melhor hoje? Podemos usar o desafio “${escapeHTML(c.title)}” como exemplo.</div>${tutorQuestion ? `<div class="chat-bubble" role="status"><strong>CODEMENTOR</strong>${escapeHTML(answers[tutorQuestion])}</div>` : ''}<p class="mini">Escolha um assunto:</p><div class="question-actions"><button data-question="conceito">Entender o exercício</button><button data-question="erro">Como revisar erros?</button><button data-question="estudo">Como estudar melhor?</button></div><p class="notice">As respostas desta tela são pré-definidas. O protótipo não utiliza um modelo de IA conectado.</p></section><aside class="card"><div class="eyebrow">Aprender sem atalhos</div><h2 class="small-title" style="margin-top:15px">A ideia é orientar, não substituir.</h2><p class="mini">O estudante continua responsável por pensar, testar hipóteses e construir a solução. As orientações servem como apoio durante o aprendizado.</p><button class="btn btn-primary" data-open="${c.id}">Abrir desafio ${icon('arrow',16)}</button></aside></div>`;
}
function progressView() {
  const completed = challenges.filter(x => progress.completed.includes(x.id));
  return `${heading('Minha evolução','Cada tentativa conta.','Acompanhe o que você já explorou e continue de onde parou. Seus dados ficam salvos apenas neste navegador.')}<div class="stat-grid"><div class="card stat"><span class="mini">Exercícios concluídos</span><strong>${completed.length}<span class="muted" style="font-size:17px"> / ${challenges.length}</span></strong><span class="mini">Atividades registradas</span></div><div class="card stat"><span class="mini">Progresso geral</span><strong>${pct()}%</strong><span class="mini">Da trilha de demonstração</span></div><div class="card stat"><span class="mini">Exercícios disponíveis</span><strong>${challenges.length}</strong><span class="mini">Do básico às funções</span></div></div><div class="section-header"><div><h2>Seus desafios concluídos</h2><p>Revisar também faz parte de aprender.</p></div></div>${completed.length ? `<div class="challenge-grid">${completed.map(challengeCard).join('')}</div>` : `<div class="empty">Você ainda não concluiu nenhum desafio. Comece com um exercício de fundamentos e faça a primeira tentativa.</div>`}<div class="section-header"><h2>Configurações</h2></div><div class="card"><h3 class="small-title">Recomeçar demonstração</h3><p class="mini">Apaga o progresso, as dicas reveladas e os rascunhos guardados neste navegador.</p><button class="btn btn-secondary" data-action="reset">${icon('rotate',16)} Limpar progresso</button></div>`;
}
function render() {
  document.documentElement.dataset.theme = progress.theme;
  const labels = { inicio: 'Visão geral', desafios: 'Biblioteca', exercicio: 'Laboratório', tutor: 'Tutor', progresso: 'Progresso' };
  const view = { inicio: homeView, desafios: challengesView, exercicio: workspaceView, tutor: tutorView, progresso: progressView }[page];
  app.innerHTML = `<div class="app"><aside class="sidebar" id="sidebar"><a class="brand" href="#inicio" data-page="inicio"><span class="brand-symbol">⌘</span><span>CodeMentor <em>AI</em></span></a><div class="nav-kicker">MENU PRINCIPAL</div><nav class="nav" aria-label="Navegação principal">${navigation.map(([key,title,ico]) => `<button type="button" class="${key === page || (key === 'desafios' && page === 'exercicio') ? 'active' : ''}" data-page="${key}">${icon(ico)} ${title}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-note"><strong>💡 Uma dica importante</strong>Aprender programação não é decorar respostas: é entender como chegar até elas.</div><button class="theme-btn" data-action="theme">${icon(progress.theme === 'dark' ? 'sun' : 'moon',17)} ${progress.theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}</button></div></aside><main class="main"><header class="topbar"><div style="display:flex;gap:12px;align-items:center"><button class="mobile-toggle" data-action="menu" aria-label="Abrir menu">${icon('menu')}</button><div class="crumb">CodeMentor AI <span aria-hidden="true">/</span> <b>${labels[page]}</b></div></div><div class="avatar" aria-label="Perfil de demonstração">CM</div></header>${view()}</main></div>`;
}
app.addEventListener('input', event => {
  if (event.target.id !== 'code-input') return;
  progress.drafts[selected] = event.target.value;
  persist();
});
app.addEventListener('click', event => {
  const target = event.target.closest('[data-page],[data-open],[data-action],[data-question]');
  if (!target) return;
  event.preventDefault();
  if (target.dataset.page) return goto(target.dataset.page);
  if (target.dataset.open) return goto('exercicio', target.dataset.open);
  if (target.dataset.question) { tutorQuestion = target.dataset.question; return render(); }
  switch(target.dataset.action) {
    case 'menu': document.querySelector('#sidebar').classList.toggle('open'); break;
    case 'theme': progress.theme = progress.theme === 'dark' ? 'light' : 'dark'; persist(); render(); break;
    case 'hint': {
      const c = getChallenge();
      progress.hints[c.id] = Math.min(Number(progress.hints[c.id] || 0) + 1, c.hints.length);
      persist(); render(); break;
    }
    case 'restore': {
      const c = getChallenge(); progress.drafts[c.id] = c.starter; persist(); feedback = null; render(); break;
    }
    case 'verify': {
      const c = getChallenge();
      const source = document.querySelector('#code-input').value;
      progress.drafts[c.id] = source;
      feedback = evaluateDraft(c, source);
      if (feedback.passed && !progress.completed.includes(c.id)) progress.completed.push(c.id);
      persist(); render(); break;
    }
    case 'reset': {
      if (!window.confirm('Deseja apagar o progresso e os rascunhos desta demonstração?')) return;
      const theme = progress.theme; progress = resetProgress(); progress.theme = theme; persist(); feedback = null; render(); break;
    }
  }
});
render();

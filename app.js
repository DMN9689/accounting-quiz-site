'use strict';

const state = {
  questionsData: null,
  curriculumData: null,
  checkpointOrder: new Map(),
  activeFilter: 'all',
  eligible: [],
  order: [],
  current: 0,
  answered: false
};

const el = {};

window.addEventListener('DOMContentLoaded', init);

async function init(){
  cacheElements();
  bindEvents();

  try{
    const [questionsResponse, curriculumResponse] = await Promise.all([
      fetch('data/questions.json', {cache:'no-store'}),
      fetch('data/curriculum.json', {cache:'no-store'})
    ]);

    if(!questionsResponse.ok) throw new Error(`questions.json 로드 실패 (${questionsResponse.status})`);
    if(!curriculumResponse.ok) throw new Error(`curriculum.json 로드 실패 (${curriculumResponse.status})`);

    const [questionsData, curriculumData] = await Promise.all([
      questionsResponse.json(),
      curriculumResponse.json()
    ]);

    validateData(questionsData, curriculumData);
    state.questionsData = questionsData;
    state.curriculumData = curriculumData;

    curriculumData.checkpoints.forEach(cp => state.checkpointOrder.set(cp.id, Number(cp.order)));

    buildProgressSelect();
    updateEligibility();

    el.loadingPanel.classList.add('hidden');
    el.setup.classList.remove('hidden');

    const total = questionsData.questions.length.toLocaleString('ko-KR');
    el.dataBadge.textContent = `기출 ${total}문제 연동`;
  }catch(error){
    console.error(error);
    el.loadingPanel.classList.add('hidden');
    el.errorPanel.classList.remove('hidden');
    el.errorMessage.textContent = error?.message || String(error);
    el.dataBadge.textContent = '데이터 로드 오류';
  }
}

function cacheElements(){
  [
    'loadingPanel','errorPanel','errorMessage','setup','progressSelect','countSelect','availableCount','setupHint','startBtn',
    'quizPanel','qIndex','qTotal','progressFill','source','qType','question','contextBlock','choices','result','resultTitle',
    'explanations','nextBtn','endPanel','restartBtn','dataBadge'
  ].forEach(id => el[id] = document.getElementById(id));
}

function bindEvents(){
  el.progressSelect.addEventListener('change', updateEligibility);
  el.countSelect.addEventListener('change', updateEligibility);
  el.startBtn.addEventListener('click', startQuiz);
  el.nextBtn.addEventListener('click', nextQuestion);
  el.restartBtn.addEventListener('click', restart);

  document.querySelectorAll('.chip[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-filter]').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      state.activeFilter = button.dataset.filter;
      updateEligibility();
    });
  });
}

function validateData(qd, cd){
  if(!qd || !Array.isArray(qd.questions)) throw new Error('questions.json 형식이 올바르지 않습니다.');
  if(!cd || !Array.isArray(cd.checkpoints)) throw new Error('curriculum.json 형식이 올바르지 않습니다.');
}

function buildProgressSelect(){
  el.progressSelect.innerHTML = '';
  const groups = new Map();

  for(const cp of state.curriculumData.checkpoints){
    if(!groups.has(cp.part)){
      const group = document.createElement('optgroup');
      group.label = `Part ${cp.part} · ${cp.part_title}`;
      groups.set(cp.part, group);
      el.progressSelect.appendChild(group);
    }

    const option = document.createElement('option');
    option.value = cp.id;
    option.textContent = `${cp.id} · ${cp.title}`;
    if(cp.id === state.curriculumData.current_checkpoint) option.selected = true;
    groups.get(cp.part).appendChild(option);
  }
}

function updateEligibility(){
  if(!state.questionsData || !state.curriculumData) return;

  const selectedCheckpoint = el.progressSelect.value;
  const selectedOrder = state.checkpointOrder.get(selectedCheckpoint);
  const questions = state.questionsData.questions;

  state.eligible = questions.filter(q => {
    if(!isQuestionAvailableAt(q, selectedOrder)) return false;
    if(state.activeFilter === 'theory' && q.section !== 'theory') return false;
    if(state.activeFilter === 'practical' && q.section !== 'practical') return false;
    return true;
  });

  const count = state.eligible.length;
  el.availableCount.textContent = `${count.toLocaleString('ko-KR')}문제`;
  el.startBtn.disabled = count === 0;

  const cp = state.curriculumData.checkpoints.find(x => x.id === selectedCheckpoint);
  const typeLabel = state.activeFilter === 'theory' ? '이론 기출' : state.activeFilter === 'practical' ? '실무·분개 기출' : '전체 기출';
  el.setupHint.textContent = cp
    ? `${cp.id} ${cp.title}까지의 진도를 기준으로 ${typeLabel} 중 출제 가능한 문제만 사용합니다.`
    : `${typeLabel} 중 출제 가능한 문제만 사용합니다.`;
}

function isQuestionAvailableAt(q, selectedOrder){
  const required = Array.isArray(q.required_concepts) ? q.required_concepts : [];
  if(required.length === 0) return false;

  for(const concept of required){
    const order = state.checkpointOrder.get(concept);
    if(order === undefined || order > selectedOrder) return false;
  }
  return true;
}

function startQuiz(){
  if(state.eligible.length === 0) return;

  const desired = el.countSelect.value === 'all'
    ? state.eligible.length
    : Math.min(Number(el.countSelect.value), state.eligible.length);

  state.order = shuffle(state.eligible).slice(0, desired);
  state.current = 0;

  el.setup.classList.add('hidden');
  el.endPanel.classList.add('hidden');
  el.quizPanel.classList.remove('hidden');
  renderQuestion();
  window.scrollTo({top:0, behavior:'smooth'});
}

function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuestion(){
  state.answered = false;
  const q = state.order[state.current];
  const total = state.order.length;

  el.qIndex.textContent = state.current + 1;
  el.qTotal.textContent = total;
  el.progressFill.style.width = `${(state.current / total) * 100}%`;
  el.source.textContent = sourceLabel(q);
  el.qType.textContent = typeLabel(q);
  el.question.textContent = q.question || '';

  const context = buildContext(q);
  if(context){
    el.contextBlock.textContent = context;
    el.contextBlock.classList.remove('hidden');
  }else{
    el.contextBlock.textContent = '';
    el.contextBlock.classList.add('hidden');
  }

  el.choices.innerHTML = '';
  q.choices.forEach((choice, idx) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.innerHTML = `<span class="num">${idx + 1}</span><span class="choiceText"></span>`;
    button.querySelector('.choiceText').textContent = choice.text ?? '';
    button.addEventListener('click', () => selectChoice(idx));
    el.choices.appendChild(button);
  });

  el.result.classList.add('hidden');
  el.resultTitle.innerHTML = '';
  el.explanations.innerHTML = '';
  el.nextBtn.textContent = state.current === total - 1 ? '풀이 완료' : '다음 문제';
}

function sourceLabel(q){
  const course = q.course || '';
  const round = q.round ? `제${q.round}회` : '';

  if(q.section === 'theory'){
    const no = q.source_question_no ? ` 이론 ${q.source_question_no}번` : ' 이론';
    return `${course} ${round}${no}`.trim();
  }

  const p = q.problem_no ? ` 문제${q.problem_no}` : '';
  const s = q.source_sub_no ? `-[${q.source_sub_no}]` : '';
  return `${course} ${round}${p}${s}`.trim();
}

function typeLabel(q){
  if(q.source_type === 'journal_to_mcq' || q.journal_explanation_only){
    return '분개 기출 · 정답 해설';
  }
  if(q.section === 'theory') return '이론 기출 · 선택지별 해설';
  return '실무 기출 · 선택지별 해설';
}

function buildContext(q){
  const blocks = [];
  if(q.problem_context) blocks.push(q.problem_context);
  if(Array.isArray(q.supplemental_context) && q.supplemental_context.length){
    blocks.push(q.supplemental_context.join('\n\n'));
  }
  return blocks.filter(Boolean).join('\n\n');
}

function selectChoice(selectedIndex){
  if(state.answered) return;
  state.answered = true;

  const q = state.order[state.current];
  const correctNo = Array.isArray(q.answer) ? Number(q.answer[0]) : Number(q.answer);
  const correctIndex = correctNo - 1;
  const isCorrect = selectedIndex === correctIndex;

  [...el.choices.querySelectorAll('.choice')].forEach((button, idx) => {
    button.classList.add('disabled');
    button.disabled = true;
    if(idx === correctIndex) button.classList.add('correct');
    if(idx === selectedIndex && idx !== correctIndex) button.classList.add('wrong');
  });

  el.result.classList.remove('hidden');
  el.resultTitle.innerHTML = isCorrect
    ? '<span class="good">✓ 정답입니다.</span>'
    : `<span class="bad">✕ 오답입니다.</span><span>정답은 ${correctNo}번입니다.</span>`;

  renderExplanation(q, selectedIndex, correctIndex);
  el.progressFill.style.width = `${((state.current + 1) / state.order.length) * 100}%`;
  el.result.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function renderExplanation(q, selectedIndex, correctIndex){
  el.explanations.innerHTML = '';

  const isJournal = q.source_type === 'journal_to_mcq' || q.journal_explanation_only;
  if(isJournal){
    const correctChoice = q.choices[correctIndex];
    const explanation = (correctChoice && correctChoice.explanation) || q.official_explanation || q.original_answer || '';
    const box = document.createElement('div');
    box.className = 'journal';
    box.textContent = explanation || '정답 해설이 제공되지 않았습니다.';
    el.explanations.appendChild(box);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'explainGrid';

  q.choices.forEach((choice, idx) => {
    const box = document.createElement('div');
    box.className = 'exp';
    if(idx === correctIndex) box.classList.add('correct');
    if(idx === selectedIndex && idx !== correctIndex) box.classList.add('selectedWrong');

    const heading = document.createElement('strong');
    heading.textContent = `${idx + 1}번 ${idx === correctIndex ? '· 정답' : '· 오답'}`;
    box.appendChild(heading);

    const text = document.createElement('div');
    text.textContent = choice.explanation || (idx === correctIndex ? q.official_explanation : '') || '해설이 제공되지 않았습니다.';
    box.appendChild(text);
    grid.appendChild(box);
  });

  el.explanations.appendChild(grid);
}

function nextQuestion(){
  if(!state.answered) return;
  if(state.current >= state.order.length - 1){
    el.quizPanel.classList.add('hidden');
    el.endPanel.classList.remove('hidden');
    window.scrollTo({top:0, behavior:'smooth'});
    return;
  }
  state.current += 1;
  renderQuestion();
  window.scrollTo({top:0, behavior:'smooth'});
}

function restart(){
  state.order = [];
  state.current = 0;
  state.answered = false;
  el.endPanel.classList.add('hidden');
  el.quizPanel.classList.add('hidden');
  el.setup.classList.remove('hidden');
  updateEligibility();
  window.scrollTo({top:0, behavior:'smooth'});
}

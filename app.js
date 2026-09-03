'use strict';

const RECENT_UNIT_LIMIT = 3;
const RANDOM_SEQUENCE_ATTEMPTS = 200;
const UNIT_WEIGHT_POWER = 1.25;

const state = {
  questionsData: null,
  curriculumData: null,
  checkpointOrder: new Map(),
  activeFilter: 'all',
  selectedUnit: 'random',
  eligible: [],
  order: [],
  current: 0,
  answered: false,
  isInfinite: false,
  solvedCount: 0,
  recentUnits: [],
  lastQuestionId: null,
  reviewQueue: new Map(),
  isReviewRound: false
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

    updateEligibility();
    updateReviewUI();

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
    'loadingPanel','errorPanel','errorMessage','setup','unitSelect','countSelect','availableCount','setupHint','startBtn',
    'quizPanel','finiteProgress','infiniteProgress','solvedCount','qIndex','qTotal','progressbar','progressFill',
    'source','qType','question','contextBlock','choices','result','resultTitle','explanations','nextBtn','endPanel',
    'restartBtn','dataBadge',
    'reviewArea','reviewCount','reviewBtn','endReviewArea','endReviewCount','endReviewBtn',
    'setupReviewArea','setupReviewCount','setupReviewBtn'
  ].forEach(id => el[id] = document.getElementById(id));
}

function bindEvents(){
  el.unitSelect.addEventListener('change', updateEligibility);
  el.countSelect.addEventListener('change', updateEligibility);
  el.startBtn.addEventListener('click', startQuiz);
  el.nextBtn.addEventListener('click', nextQuestion);
  el.restartBtn.addEventListener('click', restart);
  el.reviewBtn.addEventListener('click', startReviewRound);
  el.endReviewBtn.addEventListener('click', startReviewRound);
  el.setupReviewBtn.addEventListener('click', startReviewRound);

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

function updateEligibility(){
  if(!state.questionsData || !state.curriculumData) return;

  const baseEligible = getBaseEligibleQuestions();
  refreshUnitSelect(baseEligible);
  state.selectedUnit = el.unitSelect.value || 'random';

  state.eligible = state.selectedUnit === 'random'
    ? baseEligible.filter(q => Boolean(rotationUnit(q)))
    : baseEligible.filter(q => Array.isArray(q.required_concepts) && q.required_concepts.includes(state.selectedUnit));

  const count = state.eligible.length;
  el.availableCount.textContent = `${count.toLocaleString('ko-KR')}문제`;
  el.startBtn.disabled = count === 0;

  const typeName = state.activeFilter === 'theory' ? '이론 기출' : state.activeFilter === 'practical' ? '실무·분개 기출' : '전체 기출';
  if(state.selectedUnit === 'random'){
    const current = state.curriculumData.checkpoints.find(cp => cp.id === state.curriculumData.current_checkpoint);
    el.setupHint.textContent = current
      ? `${current.id} ${current.title}까지의 ${typeName}에서 직전 3문제와 기준 단원이 겹치지 않도록 출제합니다.`
      : `${typeName}에서 직전 3문제와 기준 단원이 겹치지 않도록 출제합니다.`;
    return;
  }

  const selected = state.curriculumData.checkpoints.find(cp => cp.id === state.selectedUnit);
  el.setupHint.textContent = selected
    ? `${selected.id} ${selected.title}와 연결된 ${typeName} ${count.toLocaleString('ko-KR')}문제를 사용합니다.`
    : `${typeName} 중 출제 가능한 문제만 사용합니다.`;
}

function getBaseEligibleQuestions(){
  const currentOrder = state.checkpointOrder.get(state.curriculumData.current_checkpoint);
  return state.questionsData.questions.filter(q => isQuestionAvailableAt(q, currentOrder) && matchesActiveFilter(q));
}

function matchesActiveFilter(q){
  if(state.activeFilter === 'theory') return q.section === 'theory';
  if(state.activeFilter === 'practical') return q.section === 'practical';
  return true;
}

function refreshUnitSelect(baseEligible){
  const previous = el.unitSelect.value || 'random';
  const currentOrder = state.checkpointOrder.get(state.curriculumData.current_checkpoint);
  const counts = new Map();

  for(const q of baseEligible){
    const concepts = Array.isArray(q.required_concepts) ? new Set(q.required_concepts) : new Set();
    for(const concept of concepts){
      if(state.checkpointOrder.has(concept)) counts.set(concept, (counts.get(concept) || 0) + 1);
    }
  }

  el.unitSelect.innerHTML = '';
  const randomOption = document.createElement('option');
  randomOption.value = 'random';
  randomOption.textContent = '무작위 단원 · 직전 3문제와 다른 단원';
  el.unitSelect.appendChild(randomOption);

  const groups = new Map();
  for(const cp of state.curriculumData.checkpoints){
    if(Number(cp.order) > currentOrder) continue;

    if(!groups.has(cp.part)){
      const group = document.createElement('optgroup');
      group.label = `Part ${cp.part} · ${cp.part_title}`;
      groups.set(cp.part, group);
      el.unitSelect.appendChild(group);
    }

    const count = counts.get(cp.id) || 0;
    const option = document.createElement('option');
    option.value = cp.id;
    option.textContent = `${cp.id} · ${cp.title} (${count.toLocaleString('ko-KR')}문제)`;
    option.disabled = count === 0;
    groups.get(cp.part).appendChild(option);
  }

  const previousOption = Array.from(el.unitSelect.options).find(option => option.value === previous);
  el.unitSelect.value = previousOption && !previousOption.disabled ? previous : 'random';
}

function rotationUnit(q){
  const unit = q && q.available_from_checkpoint;
  return unit && state.checkpointOrder.has(unit) ? unit : null;
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

  state.isInfinite = el.countSelect.value === 'infinite';
  state.isReviewRound = false;
  state.solvedCount = 0;
  state.recentUnits = [];
  state.lastQuestionId = null;
  state.current = 0;
  state.answered = false;

  try{
    const cycle = createQuestionCycle([]);
    if(state.isInfinite || el.countSelect.value === 'all'){
      state.order = cycle;
    }else{
      const desired = Math.min(Number(el.countSelect.value), cycle.length);
      state.order = cycle.slice(0, desired);
    }
  }catch(error){
    console.error(error);
    el.setupHint.textContent = error?.message || String(error);
    return;
  }

  el.setup.classList.add('hidden');
  el.endPanel.classList.add('hidden');
  el.quizPanel.classList.remove('hidden');
  renderQuestion();
  window.scrollTo({top:0, behavior:'smooth'});
}

function createQuestionCycle(startingRecentUnits = state.recentUnits){
  if(state.selectedUnit === 'random'){
    return buildRandomUnitCycle(state.eligible, startingRecentUnits);
  }

  const cycle = shuffle(state.eligible);
  if(cycle.length > 1 && state.lastQuestionId && cycle[0].id === state.lastQuestionId){
    const swapIndex = cycle.findIndex(q => q.id !== state.lastQuestionId);
    if(swapIndex > 0) [cycle[0], cycle[swapIndex]] = [cycle[swapIndex], cycle[0]];
  }
  return cycle;
}

function buildRandomUnitCycle(questions, startingRecentUnits = []){
  const grouped = new Map();
  for(const q of questions){
    const unit = rotationUnit(q);
    if(!unit) throw new Error(`기준 단원을 확인할 수 없는 문제가 있습니다: ${q.id || 'ID 없음'}`);
    if(!grouped.has(unit)) grouped.set(unit, []);
    grouped.get(unit).push(q);
  }

  const counts = new Map(Array.from(grouped, ([unit, items]) => [unit, items.length]));
  let unitOrder = null;
  for(let attempt = 0; attempt < RANDOM_SEQUENCE_ATTEMPTS && !unitOrder; attempt++){
    unitOrder = tryBuildWeightedUnitOrder(counts, startingRecentUnits);
  }
  if(!unitOrder) unitOrder = buildBalancedUnitOrder(counts, startingRecentUnits);

  const questionBuckets = new Map(Array.from(grouped, ([unit, items]) => [unit, shuffle(items)]));
  return unitOrder.map(unit => questionBuckets.get(unit).pop());
}

function tryBuildWeightedUnitOrder(initialCounts, startingRecentUnits){
  const remaining = new Map(initialCounts);
  const recent = startingRecentUnits.slice(-RECENT_UNIT_LIMIT);
  const total = Array.from(remaining.values()).reduce((sum, count) => sum + count, 0);
  const result = [];

  while(result.length < total){
    const candidates = Array.from(remaining).filter(([unit, count]) => count > 0 && !recent.includes(unit));
    if(candidates.length === 0) return null;

    const totalWeight = candidates.reduce((sum, [, count]) => sum + Math.pow(count, UNIT_WEIGHT_POWER), 0);
    let target = Math.random() * totalWeight;
    let chosenUnit = candidates[candidates.length - 1][0];
    for(const [unit, count] of candidates){
      target -= Math.pow(count, UNIT_WEIGHT_POWER);
      if(target < 0){
        chosenUnit = unit;
        break;
      }
    }

    remaining.set(chosenUnit, remaining.get(chosenUnit) - 1);
    result.push(chosenUnit);
    recent.push(chosenUnit);
    if(recent.length > RECENT_UNIT_LIMIT) recent.shift();
  }

  return result;
}

function buildBalancedUnitOrder(initialCounts, startingRecentUnits){
  const buckets = Array.from(initialCounts, ([unit, count]) => ({unit, remaining: count}));
  const recent = startingRecentUnits.slice(-RECENT_UNIT_LIMIT);
  const releaseByUnit = new Map();
  recent.forEach((unit, index) => {
    releaseByUnit.set(unit, RECENT_UNIT_LIMIT - recent.length + index + 1);
  });

  const available = [];
  const cooldown = [];
  for(const bucket of buckets){
    if(releaseByUnit.has(bucket.unit)){
      cooldown.push({bucket, releaseAt: releaseByUnit.get(bucket.unit)});
    }else{
      available.push(bucket);
    }
  }

  const total = Array.from(initialCounts.values()).reduce((sum, count) => sum + count, 0);
  const result = [];
  for(let index = 0; result.length < total; index++){
    for(let i = cooldown.length - 1; i >= 0; i--){
      if(cooldown[i].releaseAt <= index){
        available.push(cooldown[i].bucket);
        cooldown.splice(i, 1);
      }
    }

    if(available.length === 0){
      throw new Error('직전 3문제와 다른 단원으로 전체 출제 순서를 구성할 수 없습니다.');
    }

    const maxRemaining = Math.max(...available.map(bucket => bucket.remaining));
    const tied = available.filter(bucket => bucket.remaining === maxRemaining);
    const chosen = tied[Math.floor(Math.random() * tied.length)];
    available.splice(available.indexOf(chosen), 1);

    result.push(chosen.unit);
    chosen.remaining -= 1;
    if(chosen.remaining > 0){
      cooldown.push({bucket: chosen, releaseAt: index + RECENT_UNIT_LIMIT + 1});
    }
  }

  return result;
}

function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatChoiceText(value){
  const formLabels = new Set([
    '유형', '공급가액', '부가세', '거래처', '공급처', '공급처명', '전자', '분개',
    '불공제사유', '영세율구분'
  ]);
  const currencyAmount = /[-－+△]?\d[\d,]*(?:\.\d+)?\s*$/u;
  const sourceLines = String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''));

  const currencyJoined = [];
  for(const line of sourceLines){
    if(line.trim() === '원'){
      let previous = currencyJoined.length - 1;
      while(previous >= 0){
        const candidate = currencyJoined[previous].trimEnd();
        if(currencyAmount.test(candidate) && !candidate.endsWith('원')) break;
        previous -= 1;
      }
      if(previous >= 0){
        currencyJoined[previous] = `${currencyJoined[previous].trimEnd()}원`;
        continue;
      }
    }
    currencyJoined.push(line);
  }

  const semanticJoined = [];
  for(let index = 0; index < currencyJoined.length; index += 1){
    const line = currencyJoined[index];
    const trimmed = line.trim();
    const journalMarker = trimmed.match(/^\((차|대)\)$/);
    const labelMatch = trimmed.match(/^(.+?)\s*[:：]\s*$/);
    const label = labelMatch?.[1]?.trim();

    if(journalMarker || (label && formLabels.has(label))){
      let next = index + 1;
      while(next < currencyJoined.length && !currencyJoined[next].trim()) next += 1;
      if(next < currencyJoined.length){
        const prefix = trimmed;
        semanticJoined.push(`${prefix} ${currencyJoined[next].trim()}`);
        index = next;
        continue;
      }
    }
    semanticJoined.push(line);
  }

  const normalized = semanticJoined.filter(line => line.trim());

  return normalized.join('\n');
}

function renderQuestion(){
  state.answered = false;
  const q = state.order[state.current];
  const total = state.order.length;

  if(state.selectedUnit === 'random'){
    const unit = rotationUnit(q);
    if(unit){
      state.recentUnits.push(unit);
      state.recentUnits = state.recentUnits.slice(-RECENT_UNIT_LIMIT);
    }
  }
  state.lastQuestionId = q.id || null;

  if(state.isInfinite){
    el.finiteProgress.classList.add('hidden');
    el.infiniteProgress.classList.remove('hidden');
    el.progressbar.classList.add('hidden');
    el.solvedCount.textContent = state.solvedCount.toLocaleString('ko-KR');
  }else{
    el.finiteProgress.classList.remove('hidden');
    el.infiniteProgress.classList.add('hidden');
    el.progressbar.classList.remove('hidden');
    el.qIndex.textContent = state.current + 1;
    el.qTotal.textContent = total;
    el.progressFill.style.width = `${(state.current / total) * 100}%`;
  }

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
    button.querySelector('.choiceText').textContent = formatChoiceText(choice.text);
    button.addEventListener('click', () => selectChoice(idx));
    el.choices.appendChild(button);
  });

  const dontKnowIndex = q.choices.length;
  const dontKnowBtn = document.createElement('button');
  dontKnowBtn.type = 'button';
  dontKnowBtn.className = 'choice dontknow';
  dontKnowBtn.innerHTML = `<span class="num">${dontKnowIndex + 1}</span><span class="choiceText">모르겠음</span>`;
  dontKnowBtn.addEventListener('click', () => selectChoice(dontKnowIndex));
  el.choices.appendChild(dontKnowBtn);

  el.result.classList.add('hidden');
  el.resultTitle.innerHTML = '';
  el.explanations.innerHTML = '';
  el.nextBtn.textContent = !state.isInfinite && state.current === total - 1 ? '풀이 완료' : '다음 문제';
  updateReviewUI();
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
  state.solvedCount += 1;
  if(state.isInfinite) el.solvedCount.textContent = state.solvedCount.toLocaleString('ko-KR');

  const q = state.order[state.current];
  const correctNo = Array.isArray(q.answer) ? Number(q.answer[0]) : Number(q.answer);
  const correctIndex = correctNo - 1;
  const isDontKnow = selectedIndex === q.choices.length;
  const isCorrect = !isDontKnow && selectedIndex === correctIndex;

  [...el.choices.querySelectorAll('.choice')].forEach((button, idx) => {
    button.classList.add('disabled');
    button.disabled = true;
    if(idx === correctIndex) button.classList.add('correct');
    if(idx === selectedIndex && idx !== correctIndex) button.classList.add('wrong');
  });

  el.result.classList.remove('hidden');
  if(isDontKnow){
    el.resultTitle.innerHTML = `<span class="bad">🤔 모르는 문제로 표시했습니다.</span><span>정답은 ${correctNo}번입니다.</span>`;
  }else{
    el.resultTitle.innerHTML = isCorrect
      ? '<span class="good">✓ 정답입니다.</span>'
      : `<span class="bad">✕ 오답입니다.</span><span>정답은 ${correctNo}번입니다.</span>`;
  }

  if(isCorrect){
    state.reviewQueue.delete(q.id);
  }else{
    state.reviewQueue.set(q.id, q);
  }
  updateReviewUI();

  renderExplanation(q, selectedIndex, correctIndex, isDontKnow);
  if(!state.isInfinite) el.progressFill.style.width = `${((state.current + 1) / state.order.length) * 100}%`;
  el.result.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function renderExplanation(q, selectedIndex, correctIndex, isDontKnow){
  el.explanations.innerHTML = '';

  if(isDontKnow){
    const note = document.createElement('div');
    note.className = 'dontknowNote';
    note.textContent = '모르겠음으로 표시된 문제입니다. 오답으로 처리되어 복습문항에 모입니다.';
    el.explanations.appendChild(note);
  }

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
    if(state.isInfinite){
      try{
        state.order = createQuestionCycle(state.recentUnits);
        state.current = 0;
      }catch(error){
        console.error(error);
        el.nextBtn.disabled = true;
        el.nextBtn.textContent = '출제 중단';
        return;
      }
      renderQuestion();
      window.scrollTo({top:0, behavior:'smooth'});
      return;
    }

    state.isReviewRound = false;
    el.quizPanel.classList.add('hidden');
    el.endPanel.classList.remove('hidden');
    updateReviewUI();
    window.scrollTo({top:0, behavior:'smooth'});
    return;
  }

  state.current += 1;
  renderQuestion();
  window.scrollTo({top:0, behavior:'smooth'});
}

function startReviewRound(){
  if(state.reviewQueue.size === 0) return;

  state.isReviewRound = true;
  state.isInfinite = false;
  state.solvedCount = 0;
  state.recentUnits = [];
  state.lastQuestionId = null;
  state.order = shuffle(Array.from(state.reviewQueue.values()));
  state.current = 0;
  state.answered = false;
  el.nextBtn.disabled = false;

  el.setup.classList.add('hidden');
  el.endPanel.classList.add('hidden');
  el.quizPanel.classList.remove('hidden');
  renderQuestion();
  window.scrollTo({top:0, behavior:'smooth'});
}

function updateReviewUI(){
  const count = state.reviewQueue.size;
  const label = count > 0 ? `복습문항 ${count.toLocaleString('ko-KR')}개` : '';

  el.reviewCount.textContent = label;
  el.endReviewCount.textContent = label;
  el.setupReviewCount.textContent = label;

  el.endReviewArea.classList.toggle('hidden', count === 0);
  el.setupReviewArea.classList.toggle('hidden', count === 0);
  el.reviewArea.classList.toggle('hidden', count === 0 || state.isReviewRound);
}

function restart(){
  state.order = [];
  state.current = 0;
  state.answered = false;
  state.isInfinite = false;
  state.isReviewRound = false;
  state.solvedCount = 0;
  state.recentUnits = [];
  state.lastQuestionId = null;
  el.nextBtn.disabled = false;
  el.endPanel.classList.add('hidden');
  el.quizPanel.classList.add('hidden');
  el.setup.classList.remove('hidden');
  updateEligibility();
  updateReviewUI();
  window.scrollTo({top:0, behavior:'smooth'});
}

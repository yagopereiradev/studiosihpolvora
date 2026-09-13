'use strict';
const form = document.getElementById('booking-form');
const dateInput = document.getElementById('date');
function todayInSaoPaulo(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
dateInput.min = todayInSaoPaulo();
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
  form.elements.service.value=button.dataset.service;
  document.getElementById('agendamento').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  form.elements.name.focus({preventScroll:true});
}));
form.addEventListener('input',()=>{document.getElementById('request-result').hidden=true;});
form.addEventListener('submit',event=>{
  event.preventDefault();
  dateInput.min=todayInSaoPaulo();
  validatePreference();
  if(!form.reportValidity())return;
  const name=form.elements.name.value.trim();
  if(!name){form.elements.name.setCustomValidity('Informe seu primeiro nome.');form.elements.name.reportValidity();return;}
  const date=dateInput.value;
  const dateText=date?date.split('-').reverse().join('/'):'a combinar';
  const message=`Olá, Studio Sih Polvora! Meu nome é ${name}.\nTenho interesse em: ${form.elements.service.value}.\nData de preferência: ${dateText}.\nPeríodo: ${form.elements.period.value}.\nPodem informar os valores e horários disponíveis? Entendo que a reserva depende da confirmação do studio.`;
  document.getElementById('message-preview').textContent=message;
  document.getElementById('send-request').href='https://wa.me/5511940566532?text='+encodeURIComponent(message);
  document.getElementById('request-result').hidden=false;
});
form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
function validatePreference(){
  dateInput.setCustomValidity('');
  if(!dateInput.value)return;
  const day=new Date(dateInput.value+'T12:00:00').getDay();
  if(day===0||day===1)dateInput.setCustomValidity('Escolha uma data de terça a sábado.');
  if(day===6&&form.elements.period.value==='Tarde')dateInput.setCustomValidity('Aos sábados atendemos das 9h às 12h. Selecione manhã ou sem preferência.');
}
dateInput.addEventListener('input',validatePreference);
form.elements.period.addEventListener('change',validatePreference);
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  try{Promise.resolve(document.modelContext.registerTool({
    name:'select_studio_service',title:'Selecionar serviço do studio',
    description:'Seleciona um serviço no formulário visível. Não reserva horários e não envia mensagens.',
    inputSchema:{type:'object',properties:{service:{type:'string',enum:Array.from(form.elements.service.options).map(o=>o.value).filter(Boolean)}},required:['service'],additionalProperties:false},
    annotations:{readOnlyHint:false},
    execute(input){
      const allowed=Array.from(form.elements.service.options).map(o=>o.value).filter(Boolean);
      if(!input||typeof input.service!=='string'||!allowed.includes(input.service))throw new Error('Serviço inválido.');
      form.elements.service.value=input.service;
      document.getElementById('request-result').hidden=true;
      document.getElementById('agendamento').scrollIntoView();
      return {selectedService:form.elements.service.value,status:'preference_selected',bookingConfirmed:false};
    }
  },{signal:lifecycle.signal})).catch(()=>{});}catch{}
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

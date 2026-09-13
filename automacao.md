# Studio Sih Polvora — automação em preparação

## Informações confirmadas
- WhatsApp Business: +55 11 94056-6532.
- Atendimento individual: uma cliente por vez.
- Terça a sexta: 09:00–17:00. Sábado: 09:00–12:00.
- Fuso horário: America/Sao_Paulo.
- Não há agenda atual.
- Serviços divulgados no Instagram: bronzeamento natural, artificial e banho de lua. Confirmar lista atual e protocolos com a responsável antes de habilitar reservas automáticas.

## Site implementado
Apresentação e formulário que prepara uma solicitação para a cliente revisar e enviar no WhatsApp. Não cria reserva. Não envia mensagens automaticamente. Sem armazenamento de dados pessoais no site. Não aceita preferência de domingo/segunda ou sábado à tarde.

## Fluxo da automação a implementar após configuração
1. Cliente inicia conversa: menu com serviços, agendamento e falar com a equipe.
2. Coletar serviço/protocolo e preferência. Respostas sobre valores e duração somente a partir do catálogo aprovado.
3. Consultar agenda central, considerando duração, intervalo, expediente, bloqueios e uma cliente por vez. Nunca exibir disponibilidade inventada.
4. Ao selecionar horário, gravar reserva de forma atômica, com prevenção de duplicidade e conflito; confirmar apenas após gravação bem-sucedida.
5. Oferecer lembretes com autorização da cliente. Horários dos lembretes precisam ser definidos pela responsável.
6. Reagendamento e cancelamento invalidam lembretes anteriores e atualizam disponibilidade.
7. Encaminhar dúvidas fora do catálogo para a equipe; não dar aconselhamento médico ou prometer segurança/resultado de procedimentos.

## Dependências ainda pendentes
- Nomes, duração, intervalo e valores dos protocolos.
- Endereço completo e regras de cancelamento/sinal, se houver.
- Conectar o número do WhatsApp a uma integração oficial compatível com a conta; verificar acesso, requisitos e eventual cobrança antes da ativação. O aplicativo Business sozinho não fornece uma conexão automática ao site.
- Definir e conectar agenda central e armazenamento seguro com controle de acesso da responsável.
- Definir antecedência e consentimento dos lembretes, e configurar modelos de mensagem quando exigidos pelo provedor.

## Verificação antes da ativação
Testar com contato autorizado: conversa recebida, consulta real de disponibilidade, reserva concorrente, confirmação, lembrete, cancelamento, reagendamento e falhas do provedor. Nenhuma automação de produção está ativa nesta versão.

# NexaISP ISP Core — Roadmap

## Objetivo

Construir um painel ISP com experiência operacional de nível empresarial, mantendo o núcleo desacoplado de fabricantes e organizado por domínios.

## Princípios

- Interface profissional e consistente em desktop e mobile.
- Código React/TypeScript organizado por domínio.
- Modelo de dados neutro em relação a fabricante.
- Backend/API como fonte de verdade; a UI não inventa estados de rede.
- Credenciais, tokens e segredos nunca ficam expostos em componentes visuais.
- Operações críticas terão confirmação, feedback e trilha de auditoria.
- Cada módulo deve ser utilizável isoladamente antes de ser integrado ao próximo domínio.

## Ordem de construção

### 1. Fundação ISP Core

- [x] Branch `feature/isp-core` criada a partir de `main`.
- [x] Workspace profissional de clientes.
- [x] Base visual para módulos ISP.
- [x] Workspace inicial de Rede.
- [ ] Componentes compartilhados para tabelas, filtros, badges, estados vazios e modais.
- [ ] Padronização de loading/error/success em todos os domínios.

### 2. Rede — OLT / ONU / ONT

- [ ] Cadastro de OLT multi-vendor.
- [ ] Perfis de fabricante/protocolo.
- [ ] Interfaces PON.
- [ ] Descoberta de ONUs/ONTs.
- [ ] Associação ONU ↔ cliente ↔ serviço.
- [ ] Serial, LOID, PON, VLAN e perfil de serviço.
- [ ] Potência RX/TX e histórico de sinal.
- [ ] Autorização/desautorização de ONU.
- [ ] Operações em massa com confirmação e auditoria.

Referência funcional: a documentação pública do IXC descreve gerenciamento centralizado de ONUs, sincronização, potência/resumo e gráficos históricos de TX/RX; também documenta cadastro de OLT, interfaces PON e configurações de monitoramento. O NexaISP deve buscar essa cobertura sem copiar implementação ou interface. 

### 3. Rede — Routers / CCR / RB / NAS

- [ ] Cadastro de equipamentos.
- [ ] MikroTik RouterOS/API.
- [ ] CCR e RB como famílias de equipamento.
- [ ] NAS/BNG e RADIUS.
- [ ] PPPoE/DHCP.
- [ ] Interfaces, VLANs e endereçamento.
- [ ] Saúde de CPU, memória, interfaces e disponibilidade.

### 4. Clientes → Serviços → Contratos

- [ ] Perfil 360º do cliente.
- [ ] Serviços contratados.
- [ ] Plano e velocidade.
- [ ] Endereço de instalação.
- [ ] Equipamentos vinculados.
- [ ] Histórico operacional.
- [ ] Contratos e status do ciclo de vida.

### 5. Provisionamento

- [ ] Fluxo de ativação.
- [ ] Provisionamento de acesso.
- [ ] Provisionamento de ONU/ONT.
- [ ] Provisionamento de PPPoE/DHCP.
- [ ] Templates por tecnologia/fabricante.
- [ ] Fila de operações e resultado por etapa.

### 6. Financeiro

- [ ] Faturamento.
- [ ] Contas a receber.
- [ ] Pagamentos.
- [ ] Inadimplência.
- [ ] Conciliação.
- [ ] Relatórios.

### 7. Operações

- [ ] Ordens de serviço.
- [ ] Técnicos/equipes.
- [ ] Agenda e despacho.
- [ ] SLA.
- [ ] Chamados.
- [ ] Histórico de atendimento.

### 8. Observabilidade e segurança

- [ ] Auditoria de ações críticas.
- [ ] Permissões por módulo/ação.
- [ ] Status real de integração.
- [ ] Alertas operacionais.
- [ ] Histórico de eventos.

## Referências de produto

A referência não é copiar o IXC. A meta é superar a experiência operacional combinando:

- cobertura funcional de ERP/ISP;
- visão de rede em tempo real;
- filtros e ações contextuais;
- UX consistente;
- arquitetura multi-vendor;
- operação segura e auditável.

Além do IXC, plataformas ISP modernas destacam monitoramento de rede, OLT/ONU, billing, portal do cliente, mapas e automações como partes do mesmo fluxo operacional.

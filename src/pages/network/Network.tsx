import '../../styles/network.css'

type NetworkModule = {
  key: string
  title: string
  description: string
  scope: string
  status: 'planned' | 'ready'
}

const modules: NetworkModule[] = [
  {
    key: 'olts',
    title: 'OLTs',
    description: 'Cadastro e gestão de Optical Line Terminals por fabricante e método de integração.',
    scope: 'GPON · EPON · XG(S)-PON',
    status: 'ready',
  },
  {
    key: 'onus',
    title: 'ONUs / ONTs',
    description: 'Inventário de terminais, associação ao cliente, PON e leitura de sinais.',
    scope: 'Serial · LOID · PON · RX/TX',
    status: 'planned',
  },
  {
    key: 'routers',
    title: 'Routers / CCR / RB',
    description: 'Cadastro dos equipamentos de borda, acesso e distribuição do provedor.',
    scope: 'MikroTik · RouterOS · RADIUS',
    status: 'planned',
  },
  {
    key: 'nas',
    title: 'NAS / BNG',
    description: 'Pontos de autenticação e terminação de assinantes para PPPoE e outros serviços.',
    scope: 'PPPoE · DHCP · RADIUS',
    status: 'planned',
  },
]

const principles = [
  'Modelo de dados independente do fabricante.',
  'Credenciais e segredos separados da apresentação da interface.',
  'Ações destrutivas sempre exigirão confirmação explícita.',
  'Telemetria e comandos de rede serão separados do cadastro.',
]

export default function Network() {
  return (
    <div className="network-workspace">
      <header className="network-hero">
        <div>
          <span className="network-kicker">NEXAISP · NETWORK OPERATIONS</span>
          <h1>Rede</h1>
          <p>
            Centro de operação da infraestrutura do provedor, preparado para
            OLTs, ONUs/ONTs, routers, NAS e integrações multi-vendor.
          </p>
        </div>
        <div className="network-hero-badge">
          <span className="network-status-dot" />
          Arquitetura multi-vendor
        </div>
      </header>

      <section className="network-summary" aria-label="Resumo de rede">
        <article>
          <span>Ativos cadastrados</span>
          <strong>0</strong>
          <small>Aguardando integração com a API de rede</small>
        </article>
        <article>
          <span>OLTs</span>
          <strong>0</strong>
          <small>Nenhuma OLT cadastrada ainda</small>
        </article>
        <article>
          <span>ONUs / ONTs</span>
          <strong>0</strong>
          <small>Serão vinculadas aos clientes e PONs</small>
        </article>
        <article>
          <span>Routers / NAS</span>
          <strong>0</strong>
          <small>Infraestrutura de autenticação e acesso</small>
        </article>
      </section>

      <section className="network-panel">
        <div className="network-panel-header">
          <div>
            <span className="network-section-label">INFRAESTRUTURA</span>
            <h2>Domínios de rede</h2>
            <p>Organização por função, sem acoplar a interface a uma marca específica.</p>
          </div>
          <span className="network-chip">BASE ISP CORE</span>
        </div>

        <div className="network-module-grid">
          {modules.map((module) => (
            <article className="network-module-card" key={module.key}>
              <div className="network-module-top">
                <span className="network-module-icon">
                  {module.key === 'olts' ? 'OLT' : module.key === 'onus' ? 'ONU' : module.key === 'routers' ? 'RB' : 'NAS'}
                </span>
                <span className={`network-module-state network-module-state-${module.status}`}>
                  {module.status === 'ready' ? 'Próximo módulo' : 'Planejado'}
                </span>
              </div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <span className="network-module-scope">{module.scope}</span>
              <button className="network-module-button" type="button" disabled={module.status !== 'ready'}>
                {module.status === 'ready' ? 'Abrir módulo' : 'Preparar módulo'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="network-panel">
        <div className="network-panel-header">
          <div>
            <span className="network-section-label">PADRÕES DE ENGENHARIA</span>
            <h2>Base técnica do NexaISP</h2>
            <p>Regras para manter o núcleo de rede limpo, previsível e escalável.</p>
          </div>
        </div>

        <div className="network-principles">
          {principles.map((principle, index) => (
            <div className="network-principle" key={principle}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{principle}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
